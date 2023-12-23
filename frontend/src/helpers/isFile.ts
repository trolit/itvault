import type { IFileDto } from "@shared/types/dtos/File";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

export default (object: IFileDto | IDirectoryDto): object is IFileDto => {
  return "originalFilename" in object;
};
