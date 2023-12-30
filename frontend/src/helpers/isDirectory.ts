import type { IFileDTO } from "@shared/types/dtos/File";
import type { IDirectoryDTO } from "@shared/types/dtos/Directory";

export default (object: IFileDTO | IDirectoryDTO): object is IDirectoryDTO => {
  return !("originalFilename" in object);
};
