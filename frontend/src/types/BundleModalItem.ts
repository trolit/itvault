import type { IFileVariantDto } from "@shared/types/dtos/File";
import type { IBlueprintDto } from "@shared/types/dtos/Blueprint";

export type BundleModalItem = {
  blueprint: IBlueprintDto;

  files: (IFileVariantDto & { selectedVariantId: string })[];
};
