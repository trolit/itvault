import { AddBundleDto } from "@dtos/AddBundleDto";
import { Variant } from "@entities/Variant";

export interface IBundleService {
  getUniqueBlueprintIdsByVariant(
    context: AddBundleDto[],
    variant: Variant
  ): number[];
}
