import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { CustomRequest } from "@custom-types/express";
import { IFileService } from "@interfaces/service/IFileService";
import { IFileRepository } from "@interfaces/repository/IFileRepository";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

@injectable()
export class FileService implements IFileService {
  constructor(
    @inject(Di.FormidableFormFactory)
    private _formidableFormFactory: IFormidableFormFactory,
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {}

  async upload<P, B, Q>(
    workspaceId: number,
    request: CustomRequest<P, B, Q>,
    destination?: string
  ): Promise<File[] | null> {
    const form = await this._formidableFormFactory.create({
      destination,
    });

    return new Promise((resolve, reject) => {
      form.parse(request, async (error, fields, files) => {
        if (error) {
          reject(error);

          return;
        }

        if (!Object.keys(files).length) {
          return resolve(null);
        }

        const result = await this._fileRepository.save(workspaceId, files);

        return resolve(result);
      });
    });
  }
}
