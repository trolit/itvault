import { IVariantDTO } from "./Variant";

export interface IFileDTO {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;
}

export interface IFileVariantDTO {
  id: number;

  originalFilename: string;

  relativePath: string;

  createdAt: string;

  updatedAt: string;

  variants: IVariantDTO[];
}

export interface IMoveFilesDTO {
  sourceDirectoryId: number;

  targetDirectoryId: number;
}

export interface IPatchFilenameDTO {
  filename: string;
}

export interface IPatchRelativePathDTO {
  relativePath: string;
}
