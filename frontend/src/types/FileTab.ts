import type { VariantTab } from "./VariantTab";
import type { IFileDTO } from "@shared/types/DTOs/File";
import type { INoteDTO } from "@shared/types/DTOs/Note";

export type FileTab = {
  file: IFileDTO;

  activeVariantId: string;

  notes: { page: number; data: INoteDTO[]; total: number };

  variantTabs: VariantTab[];

  // @NOTE for file load through bundle
  blueprintIdToLoad?: number;
};
