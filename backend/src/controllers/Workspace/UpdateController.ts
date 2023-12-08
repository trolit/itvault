import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IWorkspaceService } from "types/services/IWorkspaceService";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { UpdateControllerTypes } from "types/controllers/Workspace/UpdateController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import SOCKET_MESSAGES from "@shared/constants/socket-messages";
import { UpdateWorkspaceMessage } from "@shared/types/transport/UpdateWorkspaceMessage";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
  constructor(
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

  static ALL_VERSIONS = [v1];

  async v1(
    request: UpdateControllerTypes.v1.Request,
    response: UpdateControllerTypes.v1.Response
  ) {
    const {
      params: { id },
      body,
    } = request;

    const result = await this._workspaceService.update(id, body);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    this._socketServiceManager.sendMessage<UpdateWorkspaceMessage, number>({
      action: SOCKET_MESSAGES.VIEW_DASHBOARD.ACTIONS.UPDATE_WORKSPACE,
      condition: latestMessage => latestMessage.data === id,
      data: { id, ...body },
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
