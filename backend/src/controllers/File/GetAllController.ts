import { inject, injectable } from "tsyringe";
import { FileMapDto } from "@mappers/FileMapDto";
import { StatusCodes as HTTP } from "http-status-codes";
import { GetAllControllerTypes } from "types/controllers/File/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { relativePath, blueprintId, workspaceId },
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

    const mappedResult = this.mapper.mapToDto(result, FileMapDto);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
