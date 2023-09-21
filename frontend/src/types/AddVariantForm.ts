import type { AddVariantDto } from "@shared/types/dtos/AddVariantDto";

export type AddVariantForm = Pick<AddVariantDto, "name"> & {
  file: File | null;
};
