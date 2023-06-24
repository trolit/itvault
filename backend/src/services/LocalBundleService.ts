import path from "path";
import JSZip from "jszip";
import fs from "fs-extra";
import { In } from "typeorm";
import { inject, injectable } from "tsyringe";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { BundleDto } from "@dtos/BundleDto";
import { IBundleService } from "@interfaces/services/IBundleService";
import { IBaseFileService } from "@interfaces/services/IBaseFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

@injectable()
export class LocalBundleService implements IBundleService {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
    @inject(Di.BucketRepository)
    private _bucketRepository: IBucketRepository,
    @inject(Di.FileService)
    private _fileService: IBaseFileService
  ) {}

  async build(workspaceId: number, data: BundleDto[]): Promise<void> {
    const variantIds: string[] = [];

    for (const elem of data) {
      elem.variantIds.map(value =>
        variantIds.includes(value) ? "" : variantIds.push(value)
      );
    }

    const [files] = await this._fileRepository.getAll({
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

    console.log("--xd1");
    console.log(files);

    const jszip = new JSZip();

    for (const file of files) {
      const { variants } = file;

      const [variant] = variants;

      const matchedData = data.filter(({ variantIds }) =>
        variantIds.some(variantId => variantId === variant.id)
      );

      const blueprintIds = matchedData.map(({ blueprintId }) => blueprintId);

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

      const fileContent = await this._fileService.readFile(
        workspaceId,
        variant
      );

      const rawContent: string[] = [];

      fileContent.split("\n").map((line, index) => {
        const matchedBuckets = buckets.filter(({ value }) => !!value[index]);

        const parsedValues: { from: number; to: number }[] = [];

        for (const { value } of matchedBuckets) {
          const line = value[index];

          const result = line.map(part => {
            const [from, to] = part.split("-");

            return {
              from: parseInt(from),
              to: parseInt(to),
            };
          });

          parsedValues.push(...result);
        }

        for (const { from, to } of parsedValues) {
          const substring = line.substring(from, to + 1);

          if (!rawContent[index]) {
            rawContent.push(substring);

            continue;
          }

          rawContent[index] =
            rawContent[index].substring(0, from) +
            substring +
            rawContent[index].substring(index + substring.length);
        }

        // 0-5, 15-30, 0-16, 4-7, 9-11
        // dupa1
        // 0-5

        // 0-5, 15-20, 40-50
        // to be:
        // 0-5, 15-20, 40-50
      });

      console.log("xdd");
      console.log(rawContent);

      const absolutePath =
        file.relativePath === "."
          ? file.originalFilename
          : file.relativePath.slice(2);

      jszip.file(absolutePath, rawContent.join("\n"));
    }

    const result = await jszip.generateAsync({ type: "nodebuffer" });

    await fs.writeFile(
      path.join(FILES.BASE_DOWNLOADS_PATH, "test.zip"),
      result
    );

    // @TODO save file name in db

    // @TODO validate if chosen variants target same file. IF NOT - DO NOT ALLOW FOR BUNDLE BUILD
  }
}
