import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

import { BaseController } from "@controllers/BaseController";

interface IParams {
  id: number;
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateController extends BaseController {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
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
    request: CustomRequest<IParams, AddEditRoleDto>,
    response: Response
  ) {
    const {
      params: { id },
      body,
    } = request;

    const result = await this._roleRepository.update(id, body);

    if (!result) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
