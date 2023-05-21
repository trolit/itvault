import { Request } from "express";

export interface IFileService {
  upload(request: Request): Promise<void>;
}
