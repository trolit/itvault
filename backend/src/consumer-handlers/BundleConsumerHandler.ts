import path from "path";
import JSZip from "jszip";
import crypto from "crypto";
import { In } from "typeorm";
import { inject } from "tsyringe";
import { IFileService } from "types/services/IFileService";
import { IDateService } from "types/services/IDateService";
import { IFileRepository } from "types/repositories/IFileRepository";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { IBucketRepository } from "types/repositories/IBucketRepository";
import { IBaseConsumerHandler } from "types/consumer-handlers/IBaseConsumerHandler";
import { BundleConsumerHandlerData } from "types/consumer-handlers/BundleConsumerHandlerData";

import { FILES } from "@config";

import { Di } from "@enums/Di";
import { Bucket } from "@entities/Bucket";
import { BundleStatus } from "@shared/types/enums/BundleStatus";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

export class BundleConsumerHandler
  implements IBaseConsumerHandler<BundleConsumerHandlerData>
{
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository,
    @inject(Di.FileService)
    private _fileService: IFileService,
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository,
    @inject(Di.DateService)
    private _dateService: IDateService
  ) {}

  async onError(data: BundleConsumerHandlerData): Promise<void> {
    const {
      bundle: { id },
    } = data;

    await this._bundleRepository.setStatus(id, BundleStatus.Failed);
  }

  async handle(data: BundleConsumerHandlerData): Promise<boolean> {
    const { bundle } = data;

    const bundleRecord = this._bundleRepository.getOne({
      where: { id: bundle.id },
    });

    if (!bundleRecord) {
      // @NOTE do not process request as bundle was probably removed (cancelled)
      return true;
    }

    await this._bundleRepository.setStatus(bundle.id, BundleStatus.Building);

    const buffer = await this.generateZipFile(data);

    if (!buffer) {
      return false;
    }

    const filename = `${crypto.randomUUID()}.zip`;

    const file = await this._fileService.writeFile({
      buffer,
      filename,
      pathToFile: FILES.BASE_DOWNLOADS_PATH,
    });

    if (!file) {
      return false;
    }

    const { expire } = bundle;

    const result = await this._bundleRepository.primitiveUpdate(
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

  private _getFiles(workspaceId: number, variantIds: string[]) {
    return this._fileRepository.getAllAndCount({
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

    const [minLineIndex, maxLineIndex] = this._getMinMaxLineIndexes(buckets);

    const isSingleLineBucket = minLineIndex === maxLineIndex;

    const splitFileContent = fileContent.split("\n");
    const splitFileContentLength = splitFileContent.length;

    for (let index = 0; index < splitFileContentLength; index++) {
      const line = splitFileContent[index];

      if (
        !isSingleLineBucket &&
        !line &&
        index >= minLineIndex &&
        index <= maxLineIndex
      ) {
        // @NOTE consider if line-break should be limited to 1 between content (?)
        result.push("");

        continue;
      }

      const matchedBuckets = buckets.filter(({ value }) => !!value[index]);

      const allLineValues = this._getAllValuesRelatedToLine(
        matchedBuckets,
        index
      );

      if (!allLineValues.length) {
        continue;
      }

      const lineBuilder: (string | null)[] = Array.from(
        { length: line.length },
        () => null
      );

      for (const { from, to } of allLineValues) {
        for (let charIndex = from; charIndex <= to; charIndex++) {
          const character = line[charIndex];

          lineBuilder[charIndex] = character;
        }
      }

      result[index] = lineBuilder.filter(value => !!value).join("");
    }

    return result.join("\n");
  }

  private _getMinMaxLineIndexes(buckets: Bucket[]) {
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

  protected async generateZipFile(handlerData: BundleConsumerHandlerData) {
    const {
      workspaceId,
      bundle: { variantToBundle, blueprintToBundle },
    } = handlerData;

    if (!variantToBundle || !blueprintToBundle) {
      await this.onError(handlerData);

      return;
    }

    const variantIds = variantToBundle.map(({ variant }) => variant.id);

    const blueprintIds = blueprintToBundle.map(({ blueprint }) => blueprint.id);

    if (!variantIds.length || !blueprintIds.length) {
      await this.onError(handlerData);

      return;
    }

    const [files] = await this._getFiles(workspaceId, variantIds);

    if (!files.length) {
      await this.onError(handlerData);

      return;
    }

    const jszip = new JSZip();

    for (const file of files) {
      if (file.variants.length !== 1) {
        await this.onError(handlerData);

        return;
      }

      const {
        directory: { relativePath },
        variants: [variant],
      } = file;

      const buckets = await this._bucketRepository.getAll({
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
        await this.onError(handlerData);

        return;
      }

      const fileContent = await this._fileService.getContent({
        variant,
        from: { workspaceId },
      });

      if (!fileContent) {
        await this.onError(handlerData);

        return;
      }

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
