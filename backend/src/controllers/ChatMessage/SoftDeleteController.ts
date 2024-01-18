import { Response } from "express";
import isInteger from "lodash/isInteger";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { SoftDeleteControllerTypes } from "types/controllers/SoftDeleteController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SoftDeleteController extends BaseController {
  constructor(
    @inject(Di.ChatMessageRepository)
    private _chatMessageRepository: IChatMessageRepository
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

  async v1(request: SoftDeleteControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      params: { id },
    } = request;

    const parsedId = parseInt(id);

    if (!isInteger(parsedId)) {
      return response.sendStatus(HTTP.BAD_REQUEST);
    }

    const message = await this._chatMessageRepository.getOne({
      where: {
        id: parsedId,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!message) {
      return response.sendStatus(HTTP.NO_CONTENT);
    }

    if (message.createdBy.id !== userId) {
      return response.sendStatus(HTTP.FORBIDDEN);
    }

    await this._chatMessageRepository.softDeleteEntity(message);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
