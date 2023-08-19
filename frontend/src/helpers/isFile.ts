import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

export default (object: IFileDto | IDirectoryDto): object is IFileDto => {
  return "originalFilename" in object;
};
