import { IVariantDto } from "./Variant";

export interface IFileVariantDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;

  variants: IVariantDto[];
}
