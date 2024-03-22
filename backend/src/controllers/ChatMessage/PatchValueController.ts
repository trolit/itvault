import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { PatchValueControllerTypes } from "types/controllers/ChatMessage/PatchValueController";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { UpdateChatMessageData } from "@shared/types/transport/ChatMessages";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class PatchValueController extends BaseController {
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

  async v1(request: PatchValueControllerTypes.v1.Request, response: Response) {
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

    await this._chatMessageRepository.primitiveSave({
      ...message,
      value: text,
    });

    const { UPDATE_MESSAGE } = SOCKET_MESSAGES.GLOBAL.ACTIONS;

    this._socketServiceManager.sendMessage<UpdateChatMessageData>({
      action: UPDATE_MESSAGE,

      data: { id, value: text },
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
