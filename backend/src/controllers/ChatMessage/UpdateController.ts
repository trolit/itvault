import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { UpdateControllerTypes } from "types/controllers/ChatMessage/UpdateController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
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

  async v1(request: UpdateControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      params: { id },
      body: { text },
    } = request;

    const message = await this._chatMessageRepository.getOne({
      where: {
        id,
        createdBy: {
          id: userId,
        },
      },
    });

    if (!message) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const isUpdated = await this._chatMessageRepository.primitiveUpdate(
      { id },
      { value: text }
    );

    if (!isUpdated?.affected) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
