import { autoInjectable, inject } from "tsyringe";
import { Workspace } from "@db/entities/Workspace";
import { StatusCodes as HTTP } from "http-status-codes";
import { WorkspaceMapper } from "@mappers/WorkspaceMapper";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetBySlugControllerTypes } from "types/controllers/Workspace/GetBySlugController";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@autoInjectable()
export class GetBySlugController extends BaseController {
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

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: GetBySlugControllerTypes.v1.Request,
    response: GetBySlugControllerTypes.v1.Response
  ) {
    const {
      userId,
      permissions,
      params: { slug },
    } = request;

    const workspace = await this._workspaceRepository.getOne({
      where: {
        slug,
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

    if (!workspace) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const result = this.mapper.map<Workspace>(workspace).to(WorkspaceMapper);

    return this.finalizeRequest(response, HTTP.OK, result);
  }
}
