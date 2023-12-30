import type { IAddVariantDTO } from "@shared/types/DTOs/Variant";

export type AddVariantForm = Pick<IAddVariantDTO, "name"> & {
  file: File | null;
};
