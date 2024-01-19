import { Response } from "express";
import isInteger from "lodash/isInteger";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { DeleteControllerTypes } from "types/controllers/DeleteController";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { DeleteChatMessageData } from "@shared/types/transport/ChatMessages";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class HardDeleteController extends BaseController {
  constructor(
    @inject(Di.ChatMessageRepository)
    private _chatMessageRepository: IChatMessageRepository,
    @inject(Di.SocketServiceManager)
    private _socketServiceManager: ISocketServiceManager
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

    await this._chatMessageRepository.hardDelete({ id: parsedId });

    const { DELETE_MESSAGE } = SOCKET_MESSAGES.VIEW_WORKSPACE.ACTIONS;

    this._socketServiceManager.sendMessage<DeleteChatMessageData>({
      action: DELETE_MESSAGE,

      data: { id: parsedId },
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
