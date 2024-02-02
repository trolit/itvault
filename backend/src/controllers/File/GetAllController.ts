import { File } from "@db/entities/File";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { FileVariantMapper } from "@mappers/FileVariantMapper";
import { IFileRepository } from "types/repositories/IFileRepository";
import { GetAllControllerTypes } from "types/controllers/File/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

// @NOTE deprecated (use TreeController from Workspace)
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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

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

    const mappedResult = this.mapper.map<File>(result).to(FileVariantMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
