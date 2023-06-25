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
import { IBundleService } from "@interfaces/services/IBundleService";
import { IBaseFileService } from "@interfaces/services/IBaseFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

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
    protected fileService: IBaseFileService,
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
      this._readFileFunction(workspaceId)
    );

    if (!buffer) {
      return;
    }

    const UUID = crypto.randomUUID();

    const filename = `${UUID}.zip`;

    const fileLocation = path.join(FILES.BASE_DOWNLOADS_PATH, filename);

    await fs.writeFile(fileLocation, buffer);

    const fileStats = await fs.stat(fileLocation);

    await this.bundleRepository.primitiveUpdate(
      {
        id: bundle.id,
      },
      {
        filename,
        size: fileStats.size,
        status: BundleStatus.Ready,
      }
    );
  }

  private _readFileFunction(workspaceId: number) {
    return (variant: Variant) => {
      return this.fileService.readFile(workspaceId, variant);
    };
  }
}
