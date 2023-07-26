import { injectable } from "tsyringe";

import { Variant } from "@entities/Variant";
import { AddBundleDto } from "@dtos/AddBundleDto";
import { IBundleService } from "@interfaces/services/IBundleService";

@injectable()
export class BundleService implements IBundleService {
  getUniqueVariantIds(context: AddBundleDto[]): string[] {
    const result: string[] = [];

    for (const { variantIds } of context) {
      variantIds.map(variantId =>
        result.includes(variantId) ? null : result.push(variantId)
      );
    }

    return result;
  }

  getUniqueBlueprintIdsByVariant(
    context: AddBundleDto[],
    variant: Variant
  ): number[] {
    const matchedContext = context.filter(({ variantIds }) =>
      variantIds.some(variantId => variantId === variant.id)
    );

    return matchedContext.map(({ blueprintId }) => blueprintId);
  }
}
