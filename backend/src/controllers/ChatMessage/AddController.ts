import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ChatMessageMapper } from "@mappers/ChatMessageMapper";
import { AddControllerTypes } from "types/controllers/ChatMessage/AddController";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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

  async v1(
    request: AddControllerTypes.v1.Request,
    response: AddControllerTypes.v1.Response
  ) {
    const {
      userId,
      query: { workspaceId },
      body: { text, replyToId },
    } = request;

    const chatMessage = await this._chatMessageRepository.primitiveSave(
      {
        value: text,
        createdBy: {
          id: userId,
        },
        replyTo: {
          id: replyToId || undefined,
        },
        workspace: {
          id: workspaceId,
        },
      },
      { reload: true }
    );

    if (!chatMessage) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    const result = this.mapper.map(chatMessage).to(ChatMessageMapper);

    return this.finalizeRequest(response, HTTP.CREATED, result);
  }
}
