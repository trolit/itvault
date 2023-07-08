import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  workspaceId: number;
}

export interface IQuery {
  blueprintId?: number;

  relativePath?: string;
}

const version1 = 1;

@injectable()
export class GetAllController extends BaseController {
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

  async v1(
    request: CustomRequest<IParams, undefined, IQuery>,
    response: CustomResponse<File[]>
  ) {
    const {
      params: { workspaceId },
      query: { relativePath, blueprintId },
    } = request;

    let result: File[] = [];

    if (relativePath) {
      result = await this._fileRepository.getAllByRelativePath(
        workspaceId,
        relativePath
      );
    }

    if (blueprintId) {
      result = await this._fileRepository.getAllByBlueprintId(
        workspaceId,
        blueprintId
      );
    }

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
