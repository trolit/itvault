import { File } from "@db/entities/File";
import { inject, injectable } from "tsyringe";
import { FileMapper } from "@mappers/FileMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileRepository } from "types/repositories/IFileRepository";
import { GetByIdControllerTypes } from "types/controllers/File/GetByIdController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetByIdController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetByIdControllerTypes.v1.Request,
    response: GetByIdControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    const file = await this._fileRepository.getOne({
      where: {
        id,
        workspace: {
          id: workspaceId,
        },
      },
      relations: {
        directory: true,
      },
    });

    if (!file) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const mappedResult = this.mapper.map<File>(file).to(FileMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
