import formidable from "formidable";

export interface IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    files: formidable.Files
  ): Promise<{ isSuccess: boolean }>;

  removeFiles(
    workspaceId: number,
    files: formidable.Files
  ): Promise<{ isSuccess: boolean }>;
}
