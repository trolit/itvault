import { BundleDto } from "@dtos/BundleDto";
import { Variant } from "@entities/Variant";

export interface IBundleService {
  getUniqueVariantIds(context: BundleDto[]): string[];

  getUniqueBlueprintIdsByVariant(
    context: BundleDto[],
    variant: Variant
  ): number[];
}
