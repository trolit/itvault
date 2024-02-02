import { File } from "@db/entities/File";
import { inject, injectable } from "tsyringe";
import { FileMapper } from "@mappers/FileMapper";
import { Directory } from "@db/entities/Directory";
import { StatusCodes as HTTP } from "http-status-codes";
import { DirectoryMapper } from "@mappers/DirectoryMapper";
import { IFileRepository } from "types/repositories/IFileRepository";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetTreeControllerTypes } from "types/controllers/Workspace/GetTreeController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetTreeController extends BaseController {
  constructor(
    @inject(Di.FileRepository)
    private _fileRepository: IFileRepository,
    @inject(Di.DirectoryRepository)
    private _directoryRepository: IDirectoryRepository
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
    request: GetTreeControllerTypes.v1.Request,
    response: GetTreeControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      query: { relativePath, blueprintId },
    } = request;

    let files: File[] = [];
    let directories: Directory[] = [];

    if (relativePath) {
      [files, directories] = await Promise.all([
        this._fileRepository.getAllByRelativePath(id, relativePath),
        this._directoryRepository.getAllByRelativePath(id, relativePath),
      ]);
    }

    if (blueprintId) {
      [files, directories] = await Promise.all([
        this._fileRepository.getAllByBlueprintId(id, blueprintId),
        this._directoryRepository.getAllByBlueprintId(id, blueprintId),
      ]);
    }

    const mappedFiles = this.mapper.map<File>(files).to(FileMapper);

    const mappedDirectories = this.mapper
      .map<Directory>(directories)
      .to(DirectoryMapper);

    return this.finalizeRequest(response, HTTP.OK, [
      ...mappedFiles,
      ...mappedDirectories,
    ]);
  }
}
