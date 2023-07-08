import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;

  fileId: number;
}

interface IBody {
  relativePath: string;
}

const version1 = 1;

@injectable()
export class PatchRelativePathController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(request: CustomRequest<IParams, IBody>, response: Response) {
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

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
