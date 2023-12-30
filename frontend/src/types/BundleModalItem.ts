import type { IFileVariantDTO } from "@shared/types/DTOs/File";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

export type BundleModalItem = {
  blueprint: IBlueprintDTO;

  files: (IFileVariantDTO & { selectedVariantId: string })[];
};
