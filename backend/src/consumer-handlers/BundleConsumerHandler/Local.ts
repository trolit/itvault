import path from "path";
import fs from "fs-extra";
import { injectable, inject } from "tsyringe";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { Bundle } from "@entities/Bundle";
import { Variant } from "@entities/Variant";
import { BundleStatus } from "@enums/BundleStatus";
import { BundleExpire } from "@enums/BundleExpire";
import { IFileService } from "@interfaces/services/IFileService";
import { IDateService } from "@interfaces/services/IDateService";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

import { BaseBundleService } from "@services/BaseBundleService";

import { IBody } from "@controllers/Bundle/StoreController";

@injectable()
export class LocalBundleConsumerHandler
  extends BaseBundleService
  implements
    IBaseConsumerHandler<{
      workspaceId: number;
      body: IBody;
      bundle: Bundle;
    }>
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

    const { location, filename } = await this._saveFile(buffer);

    const stats = await fs.stat(location);

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
        size: stats.size,
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

  // @TODO move to FileService
  private async _saveFile(buffer: Buffer) {
    const UUID = crypto.randomUUID();

    const filename = `${UUID}.zip`;

    const location = path.join(FILES.BASE_DOWNLOADS_PATH, filename);

    await fs.writeFile(location, buffer);

    return { location, filename };
  }
}
