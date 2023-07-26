import assert from "assert";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { StoreControllerTypes } from "types/controllers/File/StoreController";

import { Di } from "@enums/Di";
import { FileMapDto } from "@dtos/mappers/FileMapDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IFileService } from "@interfaces/services/IFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
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

    // @TODO chunk!!
    const result = await this._fileRepository.save(userId, workspaceId, files);

    if (!result.isSuccess) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    this._fileService.moveFilesFromTemporaryDir(workspaceId, files);

    assert(result.value);

    const mappedResult = this.mapper.mapToDto(result.value, FileMapDto);

    return this.finalizeRequest(response, HTTP.OK, mappedResult);
  }
}
