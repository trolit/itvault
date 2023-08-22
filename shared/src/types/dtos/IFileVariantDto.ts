import { IVariantDto } from "./IVariantDto";

export interface IFileVariantDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;

  variants: IVariantDto[];
}
