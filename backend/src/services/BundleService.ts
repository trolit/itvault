import { injectable } from "tsyringe";

import { Variant } from "@entities/Variant";
import { AddBundleDto } from "@dtos/AddBundleDto";
import { IBundleService } from "@interfaces/services/IBundleService";

@injectable()
export class BundleService implements IBundleService {
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
