import { In } from "typeorm";

import { Bucket } from "@entities/Bucket";
import { BundleDto } from "@dtos/BundleDto";
import { Variant } from "@entities/Variant";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

export class BaseBundleService {
  constructor(protected fileRepository: IFileRepository) {}

  protected getUniqueVariantIds(context: BundleDto[]) {
    const result: string[] = [];

    for (const { variantIds } of context) {
      variantIds.map(variantId =>
        result.includes(variantId) ? null : variantIds.push(variantId)
      );
    }

    return result;
  }

  protected getUniqueBlueprintIds(context: BundleDto[], variant: Variant) {
    const matchedContext = context.filter(({ variantIds }) =>
      variantIds.some(variantId => variantId === variant.id)
    );

    return matchedContext.map(({ blueprintId }) => blueprintId);
  }

  protected getFiles(workspaceId: number, variantIds: string[]) {
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

  protected generateData(fileContent: string, buckets: Bucket[]) {
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
}
