import { Files } from "formidable";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { CustomRequest } from "@custom-types/express";
import { IFileService } from "@interfaces/service/IFileService";
import { FormidableFormFactory } from "@factories/FormidableFormFactory";

@injectable()
export class FileService implements IFileService {
  constructor(
    @inject(Di.FormidableFormFactory)
    private _formidableFormFactory: FormidableFormFactory
  ) {}

  async upload<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    destination?: string
  ): Promise<Files> {
    const form = await this._formidableFormFactory.create(destination);

    return new Promise((resolve, reject) => {
      form.parse(request, async (error, fields, files) => {
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
