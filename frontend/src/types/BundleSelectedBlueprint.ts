import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

export type BundleSelectedBlueprint = {
  blueprint: IBlueprintDto;

  files: (IFileVariantDto & { selectedVariantId: string })[];
};
