import { Request } from "express";
import { inject, injectable } from "tsyringe";
import Formidable from "formidable/Formidable";

import { Di } from "@enums/Di";
import { IFileService } from "@interfaces/service/IFileService";

@injectable()
export class LocalFileService implements IFileService {
  constructor(
    @inject(Di.Formidable)
    private _formidable: Formidable
  ) {}

  upload(request: Request): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
