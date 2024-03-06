import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { DeleteControllerTypes } from "types/controllers/DeleteController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { BaseController } from "./BaseController";

import { getRepositoryByOriginalUrl } from "@helpers/getRepositoryByOriginalUrl";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
  static ALL_VERSIONS = [v1];

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  async v1(request: DeleteControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      originalUrl,
      params: { id },
      query: { workspaceId },
    } = request;

    const repository = getRepositoryByOriginalUrl(originalUrl);

    if (!repository) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const entity = await repository.getOne({
      where: {
        id,
        workspace: {
          id: workspaceId,
        },
      },
    });

    if (entity)
      [
        await repository.softDeleteEntity(entity, {
          data: {
            userId,
            workspaceId,
          },
        }),
      ];

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
