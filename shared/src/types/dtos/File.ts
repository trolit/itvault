import { IVariantDto } from "./Variant";

export interface IFileDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;
}

export interface IFileVariantDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;

  variants: IVariantDto[];
}

export interface IMoveFilesDto {
  sourceDirectoryId: number;

  targetDirectoryId: number;
}
