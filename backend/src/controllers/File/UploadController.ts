import assert from "assert";
import { File } from "@db/entities/File";
import { inject, injectable } from "tsyringe";
import { FileMapper } from "@mappers/FileMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { UploadControllerTypes } from "types/controllers/File/UploadController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UploadController extends BaseController {
  constructor(
    @inject(Di.FileService)
    private _fileService: IFileService
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
    request: UploadControllerTypes.v1.Request,
    response: UploadControllerTypes.v1.Response
  ) {
    const {
      files,
      userId,
      query: { workspaceId },
    } = request;

    const result = await this._fileService.handleUpload({
      files,
      author: { userId },
      target: { workspaceId },
    });

    if (!result.isSuccess) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    assert(result.value);

    const mappedResult = this.mapper.map<File>(result.value).to(FileMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
