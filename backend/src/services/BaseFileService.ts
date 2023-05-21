import { Request } from "express";

import { IBaseFileService } from "@interfaces/service/IBaseFileService";

export abstract class BaseFileService implements IBaseFileService {
  abstract upload(request: Request): Promise<void>;
}
