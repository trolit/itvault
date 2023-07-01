import path from "path";
import crypto from "crypto";
import { injectable, inject } from "tsyringe";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { Bundle } from "@entities/Bundle";
import { Variant } from "@entities/Variant";
import { BundleExpire } from "@enums/BundleExpire";
import { BundleStatus } from "@enums/BundleStatus";
import { IFileService } from "@interfaces/services/IFileService";
import { IDateService } from "@interfaces/services/IDateService";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { BaseBundleService } from "@services/BaseBundleService";

import { IBody } from "@controllers/Bundle/StoreController";

@injectable()
export class LocalBundleConsumerHandler
  extends BaseBundleService
  implements IBaseConsumerHandler<BundleConsumerHandlerData>
{
  constructor(
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository,
    @inject(Di.BucketRepository)
    protected bucketRepository: IBucketRepository,
    @inject(Di.FileService)
    protected fileService: IFileService,
    @inject(Di.BundleRepository)
    protected bundleRepository: IBundleRepository,
    @inject(Di.DateService)
    private _dateService: IDateService
  ) {
    super(fileRepository, bucketRepository, fileService, bundleRepository);
  }

  async handle(data: {
    workspaceId: number;
    body: IBody;
    bundle: Bundle;
  }): Promise<boolean> {
    // @NOTE consider using zod here (?)
    const { workspaceId, body, bundle } = data;

    await this.bundleRepository.setStatus(bundle.id, BundleStatus.Queried);

    const buffer = await this.generateZipFile(
      bundle.id,
      workspaceId,
      body,
      this._readFile(workspaceId)
    );

    if (!buffer) {
      await this.bundleRepository.setStatus(bundle.id, BundleStatus.Failed);

      return false;
    }

    const UUID = crypto.randomUUID();

    const filename = `${UUID}.zip`;

    const location = path.join(FILES.BASE_DOWNLOADS_PATH, filename);

    const file = await this.fileService.writeFile(filename, location, buffer);

    if (!file) {
      await this.bundleRepository.setStatus(bundle.id, BundleStatus.Failed);

      return false;
    }

    const { expiration } = body;

    const result = await this.bundleRepository.primitiveUpdate(
      {
        id: bundle.id,
      },
      {
        filename,
        expiresAt:
          expiration !== BundleExpire.Never
            ? this._dateService.getExpirationDate(expiration)
            : null,
        size: file.size,
        status: BundleStatus.Ready,
      }
    );

    if (!result.affected) {
      return false;
    }

    return true;
  }

  private _readFile(workspaceId: number) {
    return (variant: Variant) => {
      return this.fileService.readFile(workspaceId, variant);
    };
  }
}
