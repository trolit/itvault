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
