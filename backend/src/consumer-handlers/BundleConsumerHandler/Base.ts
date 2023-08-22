import path from "path";
import JSZip from "jszip";
import { In } from "typeorm";
import { IFileService } from "types/services/IFileService";
import { IFileRepository } from "types/repositories/IFileRepository";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { IBucketRepository } from "types/repositories/IBucketRepository";

import { FILES } from "@config/index";

import { Bucket } from "@entities/Bucket";
import { Bundle } from "@entities/Bundle";
import { Variant } from "@entities/Variant";

export abstract class BaseBundleConsumerHandler {
  constructor(
    protected fileRepository: IFileRepository,
    protected bucketRepository: IBucketRepository,
    protected fileService: IFileService,
    protected bundleRepository: IBundleRepository
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
        directory: true,
      },
    });
  }

  private _generateData(fileContent: string, buckets: Bucket[]) {
    const result: string[] = [];

    const [minLineIndex, maxLineIndex] = this._getMinMaxLineIndexes(
      fileContent,
      buckets
    );

    const splitFileContent = fileContent.split("\n");
    const splitFileContentLength = splitFileContent.length;

    for (let index = 0; index < splitFileContentLength; index++) {
      const line = splitFileContent[index];

      if (index >= minLineIndex && index <= maxLineIndex) {
        result.push("");

        continue;
      }

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
    }

    return result.join("\n");
  }

  private _getMinMaxLineIndexes(fileContent: string, buckets: Bucket[]) {
    let minLineIndex: number | null = null;
    let maxLineIndex = 0;

    for (const bucket of buckets) {
      const { value } = bucket;

      Object.keys(value).map(key => {
        const parsedKey = parseInt(key);

        if (minLineIndex === null) {
          minLineIndex = parsedKey;
        }

        if (parsedKey < minLineIndex) {
          minLineIndex = parsedKey;
        }

        if (parsedKey > maxLineIndex) {
          maxLineIndex = parsedKey;
        }
      });
    }

    if (minLineIndex === null) {
      minLineIndex = 0;
    }

    return [minLineIndex, maxLineIndex];
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
    readFile: (variant: Variant) => Promise<string>,
    onError: () => Promise<void>
  ) {
    const { variantToBundle, blueprintToBundle } = bundle;

    if (!variantToBundle || !blueprintToBundle) {
      await onError();

      return;
    }

    const variantIds = variantToBundle.map(({ variant }) => variant.id);

    const blueprintIds = blueprintToBundle.map(({ blueprint }) => blueprint.id);

    if (!variantIds.length || !blueprintIds.length) {
      await onError();

      return;
    }

    const [files] = await this._getFiles(workspaceId, variantIds);

    if (!files.length) {
      await onError();

      return;
    }

    const jszip = new JSZip();

    for (const file of files) {
      if (file.variants.length !== 1) {
        await onError();

        return;
      }

      const {
        directory: { relativePath },
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
        await onError();

        return;
      }

      const fileContent = await readFile(variant);

      const data = this._generateData(fileContent, buckets);

      const absolutePath =
        relativePath === FILES.ROOT
          ? file.originalFilename
          : relativePath.slice(2); // @NOTE e.g. ./src -> src

      jszip.file(path.join(absolutePath, file.originalFilename), data);
    }

    return jszip.generateAsync({ type: "nodebuffer" });
  }
}
