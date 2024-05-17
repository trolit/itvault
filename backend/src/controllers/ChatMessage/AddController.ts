import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ChatMessageMapper } from "@mappers/ChatMessageMapper";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { AddControllerTypes } from "types/controllers/ChatMessage/AddController";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { AddChatMessageData } from "@shared/types/transport/ChatMessages";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      userId,
      body: { text, replyToId },
    } = request;

    const message = await this._chatMessageRepository.primitiveSave({
      value: text,
      createdBy: {
        id: userId,
      },
      replyTo: {
        id: replyToId,
      },
    });

    if (!message) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    const result = this.mapper.map(message).to(ChatMessageMapper);

    const { CREATE_MESSAGE } = SOCKET_MESSAGES.GLOBAL.ACTIONS;

    this._socketServiceManager.sendMessage<AddChatMessageData>({
      action: CREATE_MESSAGE,

      data: result,
    });

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
