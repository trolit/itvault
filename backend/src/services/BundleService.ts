import { injectable } from "tsyringe";

import { BundleDto } from "@dtos/BundleDto";
import { Variant } from "@entities/Variant";
import { IBundleService } from "@interfaces/services/IBundleService";

@injectable()
export class BundleService implements IBundleService {
  getUniqueVariantIds(context: BundleDto[]): string[] {
    const result: string[] = [];

    for (const { variantIds } of context) {
      variantIds.map(variantId =>
        result.includes(variantId) ? null : result.push(variantId)
      );
    }

    return result;
  }

  getUniqueBlueprintIdsByVariant(
    context: BundleDto[],
    variant: Variant
  ): number[] {
    const matchedContext = context.filter(({ variantIds }) =>
      variantIds.some(variantId => variantId === variant.id)
    );

    return matchedContext.map(({ blueprintId }) => blueprintId);
  }
}
