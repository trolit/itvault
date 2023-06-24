import path from "path";
import JSZip from "jszip";
import fs from "fs-extra";
import crypto from "crypto";
import { In } from "typeorm";
import { inject, injectable } from "tsyringe";

import { FILES } from "@config/index";

import { BaseBundleService } from "./BaseBundleService";

import { Di } from "@enums/Di";
import { BundleDto } from "@dtos/BundleDto";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IBaseFileService } from "@interfaces/services/IBaseFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

// @NOTE consider adding "status" column to "Bundle" entity - "generating" / "ready" / "failed"
@injectable()
export class LocalBundleService
  extends BaseBundleService
  implements IBundleService
{
  constructor(
    @inject(Di.FileRepository)
    protected _fileRepository: IFileRepository,
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository,
    @inject(Di.FileService)
    private _fileService: IBaseFileService,
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
  ) {
    super(_fileRepository);
  }

  async build(workspaceId: number, context: BundleDto[]): Promise<void> {
    const variantIds = this.getUniqueVariantIds(context);

    const [files] = await this.getFiles(workspaceId, variantIds);

    if (!files.length) {
      // err

      return;
    }

    const jszip = new JSZip();

    for (const file of files) {
      if (file.variants.length !== 1) {
        // err

        return;
      }

      const {
        variants: [variant],
      } = file;

      const blueprintIds = this.getUniqueBlueprintIds(context, variant);

      const [buckets] = await this._bucketRepository.getAll({
        where: {
          blueprint: {
            id: In(blueprintIds),
          },
          variant: {
            id: variant.id,
          },
        },
      });

      if (!buckets) {
        // err

        return;
      }

      const fileContent = await this._fileService.readFile(
        workspaceId,
        variant
      );

      const data = this.generateData(fileContent, buckets);

      const absolutePath =
        file.relativePath === "."
          ? file.originalFilename
          : file.relativePath.slice(2); // @NOTE ./src -> src

      jszip.file(absolutePath, data);
    }

    const buffer = await jszip.generateAsync({ type: "nodebuffer" });

    const UUID = crypto.randomUUID();

    const filename = `${UUID}.zip`;

    const fileLocation = path.join(FILES.BASE_DOWNLOADS_PATH, filename);

    await fs.writeFile(fileLocation, buffer);

    const fileStats = await fs.stat(fileLocation);

    await this._bundleRepository.primitiveUpdate(
      {
        id: 1, // @TODO
      },
      {
        filename,
        size: fileStats.size,
        blueprints: [{ id: 1 }], // @TODO
      }
    );
  }
}
