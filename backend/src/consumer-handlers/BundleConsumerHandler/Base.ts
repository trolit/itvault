import JSZip from "jszip";
import { In } from "typeorm";

import { Bucket } from "@entities/Bucket";
import { Bundle } from "@entities/Bundle";
import { Variant } from "@entities/Variant";
import { BundleStatus } from "@enums/BundleStatus";
import { IFileService } from "@interfaces/services/IFileService";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

export abstract class BaseBundleConsumerHandler {
  constructor(
    protected fileRepository: IFileRepository,
    protected bucketRepository: IBucketRepository,
    protected fileService: IFileService,
    protected bundleRepository: IBundleRepository,
    protected bundleService: IBundleService
  ) {}

  private _getFiles(workspaceId: number, variantIds: string[]) {
    return this.fileRepository.getAll({
      where: {
        workspace: {
          id: workspaceId,
        },
        variants: {
          id: In(variantIds),
        },
      },
      relations: {
        variants: true,
      },
    });
  }

  private _generateData(fileContent: string, buckets: Bucket[]) {
    const result: string[] = [];

    fileContent.split("\n").map((line, index) => {
      const matchedBuckets = buckets.filter(({ value }) => !!value[index]);

      const allLineValues = this._getAllValuesRelatedToLine(
        matchedBuckets,
        index
      );

      for (const { from, to } of allLineValues) {
        const part = line.substring(from, to + 1);

        if (!result[index]) {
          result.push(part);

          continue;
        }

        const currentValue = result[index];

        result[index] = currentValue
          .substring(0, from)
          .concat(part, currentValue.substring(index + part.length));
      }
    });

    return result.join("\n");
  }

  private _getAllValuesRelatedToLine(
    buckets: Bucket[],
    index: number
  ): { from: number; to: number }[] {
    const result: { from: number; to: number }[] = [];

    for (const { value } of buckets) {
      const bucketValue = value[index];

      const currentResult = bucketValue.map(entry => {
        const [from, to] = entry.split("-");

        return {
          to: parseInt(to),
          from: parseInt(from),
        };
      });

      result.push(...currentResult);
    }

    return result;
  }

  protected async generateZipFile(
    workspaceId: number,
    bundle: Bundle,
    readFileFunction: (variant: Variant) => Promise<string>
  ) {
    const { id: bundleId, variants, blueprints } = bundle;

    const variantIds = variants.map(({ id }) => id);

    const blueprintIds = blueprints.map(({ id }) => id);

    if (!variantIds.length || !blueprintIds.length) {
      await this.bundleRepository.setStatus(bundleId, BundleStatus.Failed);

      return;
    }

    const [files] = await this._getFiles(workspaceId, variantIds);

    if (!files.length) {
      await this.bundleRepository.setStatus(bundleId, BundleStatus.Failed);

      return;
    }

    const jszip = new JSZip();

    for (const file of files) {
      if (file.variants.length !== 1) {
        await this.bundleRepository.setStatus(bundleId, BundleStatus.Failed);

        return;
      }

      const {
        variants: [variant],
      } = file;

      const [buckets] = await this.bucketRepository.getAll({
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
        await this.bundleRepository.setStatus(bundleId, BundleStatus.Failed);

        return;
      }

      const fileContent = await readFileFunction(variant);

      const data = this._generateData(fileContent, buckets);

      const absolutePath =
        file.relativePath === "."
          ? file.originalFilename
          : file.relativePath.slice(2); // @NOTE ./src -> src

      jszip.file(absolutePath, data);
    }

    return jszip.generateAsync({ type: "nodebuffer" });
  }
}
