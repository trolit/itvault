import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "@custom-types/express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { IController } from "@interfaces/IController";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

interface IParams {
  workspaceId: number;

  fileId: number;
}

interface IBody {
  relativePath: string;
}

@injectable()
export class PatchRelativePathController
  implements IController<IParams, IBody>
{
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {}

  async invoke(request: CustomRequest<IParams, IBody>, response: Response) {
    const {
      params: { fileId },
      body: { relativePath },
    } = request;

    const result = await this._fileRepository.primitiveUpdate(
      {
        id: fileId,
      },
      { relativePath }
    );

    if (!result.affected) {
      return response.status(HTTP.NOT_MODIFIED).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
