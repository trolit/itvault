import { Files } from "formidable";
import { CustomRequest } from "@custom-types/express";

export interface IFileService {
  upload<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    destination?: string
  ): Promise<Files>;
}
