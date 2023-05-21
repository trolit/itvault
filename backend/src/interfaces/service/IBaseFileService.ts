import { Request } from "express";

export interface IBaseFileService {
  upload(request: Request): Promise<void>;
}
