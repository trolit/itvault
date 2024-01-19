import { FindOptionsSelect } from "typeorm";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ChatMessageMapper } from "@mappers/ChatMessageMapper";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetAllControllerTypes } from "types/controllers/ChatMessage/GetAllController";

import { Di } from "@enums/Di";
import { ChatMessage } from "@entities/ChatMessage";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
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

  private get _select(): FindOptionsSelect<ChatMessage> {
    return {
      id: true,
      value: true,
      repliesCount: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      createdBy: {
        id: true,
        fullName: true,
      },
    };
  }

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { skip, take, messageId, workspaceId },
    } = request;

    const parentMessage = messageId
      ? await this._chatMessageRepository.getById(messageId)
      : null;

    const [result, total] = await this._chatMessageRepository.getAllAndCount({
      select: this._select,
      skip,
      take,
      where: {
        workspace: { id: workspaceId },
        depth: parentMessage && messageId ? parentMessage.depth + 1 : 1,
        replyTo: {
          id: messageId || undefined,
        },
      },
      order: {
        createdAt: "desc",
      },
      relations: {
        createdBy: true,
      },
    });

    const mappedResult = this.mapper
      .map<ChatMessage>(result)
      .to(ChatMessageMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
