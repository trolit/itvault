import type { IFileVariantDTO } from "@shared/types/dtos/File";
import type { IBlueprintDTO } from "@shared/types/dtos/Blueprint";

export type BundleModalItem = {
  blueprint: IBlueprintDTO;

  files: (IFileVariantDTO & { selectedVariantId: string })[];
};
