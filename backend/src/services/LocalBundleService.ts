import path from "path";
import fs from "fs-extra";
import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { FILES } from "@config/index";

import { BaseBundleService } from "./BaseBundleService";

import { Di } from "@enums/Di";
import { Bundle } from "@entities/Bundle";
import { Variant } from "@entities/Variant";
import { BundleStatus } from "@enums/BundleStatus";
import { IFileService } from "@interfaces/services/IFileService";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { IBody } from "@controllers/Bundle/StoreController";

// @NOTE consider adding "status" column to "Bundle" entity - "generating" / "ready" / "failed"
@injectable()
export class LocalBundleService
  extends BaseBundleService
  implements IBundleService
{
  constructor(
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository,
    @inject(Di.BucketRepository)
    protected bucketRepository: IBucketRepository,
    @inject(Di.FileService)
    protected fileService: IFileService,
    @inject(Di.BundleRepository)
    protected bundleRepository: IBundleRepository
  ) {
    super(fileRepository, bucketRepository, fileService, bundleRepository);
  }

  async build(workspaceId: number, body: IBody, bundle: Bundle): Promise<void> {
    await this.bundleRepository.setStatus(bundle.id, BundleStatus.Queried);

    const buffer = await this.generateZipFile(
      bundle.id,
      workspaceId,
      body,
      this._readFile(workspaceId)
    );

    if (!buffer) {
      return;
    }

    const { location, filename } = await this._saveFile(buffer);

    const stats = await fs.stat(location);

    await this.bundleRepository.primitiveUpdate(
      {
        id: bundle.id,
      },
      {
        filename,
        size: stats.size,
        status: BundleStatus.Ready,
      }
    );
  }

  private _readFile(workspaceId: number) {
    return (variant: Variant) => {
      return this.fileService.readFile(workspaceId, variant);
    };
  }

  private async _saveFile(buffer: Buffer) {
    const UUID = crypto.randomUUID();

    const filename = `${UUID}.zip`;

    const location = path.join(FILES.BASE_DOWNLOADS_PATH, filename);

    await fs.writeFile(location, buffer);

    return { location, filename };
  }
}
