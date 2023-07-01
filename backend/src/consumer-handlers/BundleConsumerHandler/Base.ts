import JSZip from "jszip";
import { In } from "typeorm";

import { Bucket } from "@entities/Bucket";
import { BundleDto } from "@dtos/BundleDto";
import { Variant } from "@entities/Variant";
import { BundleStatus } from "@enums/BundleStatus";
import { IFileService } from "@interfaces/services/IFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

import { IBody } from "@controllers/Bundle/StoreController";

export abstract class BaseBundleConsumerHandler {
  constructor(
    protected fileRepository: IFileRepository,
    protected bucketRepository: IBucketRepository,
    protected fileService: IFileService,
    protected bundleRepository: IBundleRepository
  ) {}

  private _getUniqueVariantIds(context: BundleDto[]) {
    const result: string[] = [];

    for (const { variantIds } of context) {
      variantIds.map(variantId =>
        result.includes(variantId) ? null : result.push(variantId)
      );
    }

    return result;
  }

  private _getUniqueBlueprintIds(context: BundleDto[], variant: Variant) {
    const matchedContext = context.filter(({ variantIds }) =>
      variantIds.some(variantId => variantId === variant.id)
    );

    return matchedContext.map(({ blueprintId }) => blueprintId);
  }

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
    bundleId: number,
    workspaceId: number,
    body: IBody,
    readFileFunction: (variant: Variant) => Promise<string>
  ) {
    const { values: context } = body;

    const variantIds = this._getUniqueVariantIds(context);

    if (!variantIds.length) {
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

      const blueprintIds = this._getUniqueBlueprintIds(context, variant);

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
