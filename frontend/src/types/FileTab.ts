import type { VariantTab } from "./VariantTab";
import type { INoteDto } from "@shared/types/dtos/Note";
import type { IFileDto } from "@shared/types/dtos/IFileDto";

export type FileTab = {
  file: IFileDto;

  activeVariantId: string;

  notes: { page: number; data: INoteDto[]; total: number };

  variantTabs: VariantTab[];
};
