import type { VariantTab } from "./VariantTab";
import type { IFileDTO } from "@shared/types/dtos/File";
import type { INoteDTO } from "@shared/types/dtos/Note";

export type FileTab = {
  file: IFileDTO;

  activeVariantId: string;

  notes: { page: number; data: INoteDTO[]; total: number };

  variantTabs: VariantTab[];
};
