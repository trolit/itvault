import { autoInjectable, inject } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapDto } from "@mappers/WorkspaceMapDto";
import { GetAllControllerTypes } from "types/controllers/Workspace/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      userId,
      permissions,
      query: { skip, take },
    } = request;

    const [result, total] = await this._workspaceRepository.getAll({
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

    const mappedResult = this.mapper.mapToDto(result, WorkspaceMapDto);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
