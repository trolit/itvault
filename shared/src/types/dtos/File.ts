import { IVariantDto } from "./Variant";

export interface IFileDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;
}

export interface IMoveFilesDto {
  sourceDirectoryId: number;

  targetDirectoryId: number;
}

export interface IFileVariantDto {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;

  variants: IVariantDto[];
}
