import { Response } from "express";
import isInteger from "lodash/isInteger";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { DeleteControllerTypes } from "types/controllers/DeleteController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { FILES } from "@config/index";

import { Di } from "@enums/Di";
import { FileStorageMode } from "@enums/FileStorageMode";
import { Permission } from "@shared/types/enums/Permission";
import { BundleStatus } from "@shared/types/enums/BundleStatus";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository,
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

  async v1(request: DeleteControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      permissions,
      query: { workspaceId },
      params: { id },
    } = request;

    const parsedId = parseInt(id);

    if (!isInteger(parsedId)) {
      return response.sendStatus(HTTP.BAD_REQUEST);
    }

    const bundle = await this._bundleRepository.getOne({
      where: {
        id: parsedId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!bundle) {
      return response.sendStatus(HTTP.NO_CONTENT);
    }

    if (bundle.status === BundleStatus.Building) {
      return response.sendStatus(HTTP.BAD_REQUEST);
    }

    if (
      bundle.createdBy?.id !== userId &&
      !isPermissionEnabled(Permission.DeleteAnyBundle, permissions)
    ) {
      return response.sendStatus(HTTP.FORBIDDEN);
    }

    // @NOTE consider adding subscriber and set "size" to 0 and/or filename to NULL to mark that we do not have it anymore (?)
    await this._bundleRepository.softDeleteEntity(
      bundle,
      getOptionsOfTraceRelatedEntity({
        userId,
        workspaceId,
      })
    );

    if (bundle.status !== BundleStatus.Enqueued) {
      await this._fileService.deleteFile({
        filename: bundle.filename,
        pathToFile:
          FILES.ACTIVE_MODE === FileStorageMode.Local
            ? FILES.BASE_DOWNLOADS_PATH
            : undefined,
      });
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
