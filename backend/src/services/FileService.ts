import { Files } from "formidable";
import { inject, injectable } from "tsyringe";
import Formidable from "formidable/Formidable";

import { Di } from "@enums/Di";
import { CustomRequest } from "@custom-types/express";
import { IFileService } from "@interfaces/service/IFileService";

@injectable()
export class LocalFileService implements IFileService {
  constructor(
    @inject(Di.Formidable)
    private _formidable: Formidable
  ) {}

  upload<P, B, Q>(request: CustomRequest<P, B, Q>): Promise<Files> {
    return new Promise((resolve, reject) => {
      this._formidable.parse(request, async (error, fields, files) => {
        if (error) {
          reject(error);

          return;
        }

        // @TODO
        console.log(files);

        return resolve(files);
      });
    });
  }
}
