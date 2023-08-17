import type { VariantTab } from "./VariantTab";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { INoteDto } from "@shared/types/dtos/INoteDto";

export type FileTab = {
  file: IFileDto;

  activeVariantTab: string; // @NOTE id of variant

  notes: { data: INoteDto[]; total: number };

  variantTabs: VariantTab[];
};
