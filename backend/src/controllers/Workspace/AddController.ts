import assert from "assert";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IWorkspaceService } from "types/services/IWorkspaceService";
import { IUserRepository } from "types/repositories/IUserRepository";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { AddControllerTypes } from "types/controllers/Workspace/AddController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { CreateWorkspaceData } from "@shared/types/transport/WorkspaceMessages";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.WorkspaceService)
    private _workspaceService: IWorkspaceService,
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
    const { body } = request;

    const result = await this._workspaceService.create(body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    assert(result.value);

    const mappedResult = this.mapper.map(result.value).to(WorkspaceMapper);

    const { CREATE_WORKSPACE } = SOCKET_MESSAGES.VIEW_DASHBOARD.ACTIONS;

    this._socketServiceManager.sendMessage<CreateWorkspaceData>({
      action: CREATE_WORKSPACE,

      data: mappedResult,

      filter: async members => {
        const userIds = members.map(member => member.uid);

        const permittedUsers =
          await this._userRepository.filterUsersWithAccessToWorkspace(
            mappedResult.id,
            userIds
          );

        return members.filter(member =>
          permittedUsers.some(user => user.id === member.uid)
        );
      },
    });

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
