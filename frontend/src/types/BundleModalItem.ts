import type { IBlueprintDto } from "@shared/types/dtos/Blueprint";
import type { IFileVariantDto } from "@shared/types/dtos/IFileVariantDto";

export type BundleModalItem = {
  blueprint: IBlueprintDto;

  files: (IFileVariantDto & { selectedVariantId: string })[];
};
