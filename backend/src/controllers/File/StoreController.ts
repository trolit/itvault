import assert from "assert";
import { inject, injectable } from "tsyringe";
import { FileMapper } from "@mappers/FileMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { StoreControllerTypes } from "types/controllers/File/StoreController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { File } from "@entities/File";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.FileService)
    private _fileService: IFileService
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
    request: StoreControllerTypes.v1.Request,
    response: StoreControllerTypes.v1.Response
  ) {
    const {
      files,
      userId,
      query: { workspaceId },
    } = request;

    const result = await this._fileService.saveFilesAndDirectories(
      userId,
      workspaceId,
      files
    );

    if (!result.isSuccess) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    this._fileService.moveFilesFromTemporaryDir(workspaceId, files);

    assert(result.value);

    const mappedResult = this.mapper.map<File>(result.value).to(FileMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
