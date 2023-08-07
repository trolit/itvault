import crypto from "crypto";
import { injectable, inject } from "tsyringe";

import { FILES } from "@config";

import { BaseBundleConsumerHandler } from "./Base";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import { IDateService } from "@interfaces/services/IDateService";
import { IFileService } from "@interfaces/services/IFileService";
import { BundleConsumerHandlerData } from "consumer-handlers-types";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

@injectable()
export class LocalBundleConsumerHandler
  extends BaseBundleConsumerHandler
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

  async handle(data: BundleConsumerHandlerData): Promise<boolean> {
    // @NOTE consider using yup here (?)
    const { workspaceId, bundle } = data;

    await this.bundleRepository.setStatus(bundle.id, BundleStatus.Building);

    const buffer = await this.generateZipFile(
      workspaceId,
      bundle,
      this._readFile(workspaceId),
      () => this.onError(data)
    );

    if (!buffer) {
      return false;
    }

    const filename = `${crypto.randomUUID()}.zip`;

    const file = await this.fileService.writeFile(
      filename,
      FILES.BASE_DOWNLOADS_PATH,
      buffer
    );

    if (!file) {
      return false;
    }

    const { expire } = bundle;

    const result = await this.bundleRepository.primitiveUpdate(
      {
        id: bundle.id,
      },
      {
        filename,
        expiresAt:
          expire !== BundleExpire.Never
            ? this._dateService.getExpirationDate(expire)
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

  async onError(data: BundleConsumerHandlerData): Promise<void> {
    const {
      bundle: { id },
    } = data;

    await this.bundleRepository.setStatus(id, BundleStatus.Failed);
  }

  private _readFile(workspaceId: number) {
    return (variant: Variant) => {
      return this.fileService.readFile(workspaceId, variant);
    };
  }
}
