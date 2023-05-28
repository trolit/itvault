import { File } from "@entities/File";
import { CustomRequest } from "@custom-types/express";

export interface IFileService {
  upload<P, B, Q>(
    workspaceId: number,
    request: CustomRequest<P, B, Q>,
    destination?: string
  ): Promise<File[] | null>;
}
