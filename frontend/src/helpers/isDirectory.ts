import type { IFileDto } from "@shared/types/dtos/File";
import type { IDirectoryDto } from "@shared/types/dtos/Directory";

export default (object: IFileDto | IDirectoryDto): object is IDirectoryDto => {
  return !("originalFilename" in object);
};
