import { Like } from "typeorm";
import { autoInjectable, inject } from "tsyringe";
import { Workspace } from "@db/entities/Workspace";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { GetAllControllerTypes } from "types/controllers/Workspace/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
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
      query: { skip, take, filters, ignorePagination },
    } = request;

    const isNameFilterDefined = !!filters.name;
    const isUserIdFilterDefined = !!filters.userId;

    if (
      isUserIdFilterDefined &&
      filters.userId !== userId &&
      (!isPermissionEnabled(Permission.ViewAllUsers, permissions) ||
        !isPermissionEnabled(Permission.ViewAllWorkspaces, permissions))
    ) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    // @NOTE super specific check for "manage user workspaces"
    if (
      ignorePagination &&
      (!isUserIdFilterDefined ||
        filters.userId === userId ||
        !isPermissionEnabled(Permission.ManageUserWorkspaces, permissions))
    ) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const userIdQuery = isUserIdFilterDefined
      ? { userId: filters.userId }
      : {
          userId: isPermissionEnabled(Permission.ViewAllWorkspaces, permissions)
            ? undefined
            : userId,
        };

    const nameQuery = {
      name: isNameFilterDefined ? Like(`%${filters.name}%`) : undefined,
    };

    const [result, total] = await this._workspaceRepository.getAllAndCount({
      skip: ignorePagination ? undefined : skip,
      take: ignorePagination ? undefined : take,
      order: {
        pinnedAt: "desc",
        createdAt: "desc",
      },
      where: {
        ...nameQuery,
        userToWorkspace: {
          ...userIdQuery,
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
