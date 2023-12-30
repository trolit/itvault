import type { IAddVariantDTO } from "@shared/types/dtos/Variant";

export type AddVariantForm = Pick<IAddVariantDTO, "name"> & {
  file: File | null;
};
