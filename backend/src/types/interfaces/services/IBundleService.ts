import { AddBundleDto } from "@dtos/AddBundleDto";
import { Variant } from "@entities/Variant";

export interface IBundleService {
  getUniqueVariantIds(context: AddBundleDto[]): string[];

  getUniqueBlueprintIdsByVariant(
    context: AddBundleDto[],
    variant: Variant
  ): number[];
}
