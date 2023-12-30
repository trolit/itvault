import type { IFileDTO } from "@shared/types/DTOs/File";
import type { IDirectoryDTO } from "@shared/types/DTOs/Directory";

export default (object: IFileDTO | IDirectoryDTO): object is IDirectoryDTO => {
  return !("originalFilename" in object);
};
