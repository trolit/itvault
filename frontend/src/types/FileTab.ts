import type { VariantTab } from "./VariantTab";
import type { IFileDto } from "@shared/types/dtos/File";
import type { INoteDto } from "@shared/types/dtos/Note";

export type FileTab = {
  file: IFileDto;

  activeVariantId: string;

  notes: { page: number; data: INoteDto[]; total: number };

  variantTabs: VariantTab[];
};
