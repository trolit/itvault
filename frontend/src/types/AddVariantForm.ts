import type { IAddVariantDto } from "@shared/types/dtos/Variant";

export type AddVariantForm = Pick<IAddVariantDto, "name"> & {
  file: File | null;
};
