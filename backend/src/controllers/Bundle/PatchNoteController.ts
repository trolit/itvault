import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBundleRepository } from "types/repositories/IBundleRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchNoteControllerTypes } from "types/controllers/Bundle/PatchNoteController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchNoteController extends BaseController {
  constructor(
    @inject(Di.BundleRepository)
    private _bundleRepository: IBundleRepository
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
    request: PatchNoteControllerTypes.v1.Request,
    response: PatchNoteControllerTypes.v1.Response
  ) {
    const {
      userId,
      params: { id },
      body: { text },
      query: { workspaceId },
    } = request;

    const bundle = await this._bundleRepository.getOne({
      where: {
        id,
        createdBy: {
          id: userId,
        },
        workspace: {
          id: workspaceId,
        },
      },
    });

    if (!bundle) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    await this._bundleRepository.primitiveSave({
      ...bundle,
      note: text,
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
