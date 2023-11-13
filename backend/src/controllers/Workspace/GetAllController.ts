import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { GetAllControllerTypes } from "types/controllers/Workspace/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetAllController extends BaseController {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      userId,
      permissions,
      query: { skip, take },
    } = request;

    const [result, total] = await this._workspaceRepository.getAllAndCount({
      skip,
      take,
      order: {
        name: "asc",
      },
      where: {
        userToWorkspace: {
          userId: isPermissionEnabled(Permission.ViewAllWorkspaces, permissions)
            ? undefined
            : userId,
        },
      },
      relations: {
        userToWorkspace: true,
        tagToWorkspace: {
          tag: true,
        },
      },
    });

    const mappedResult = this.mapper.map<Workspace>(result).to(WorkspaceMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
