import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { CustomRequest } from "@custom-types/express";
import { IController } from "types/interfaces/IController";
import { IRoleRepository } from "types/interfaces/repository/IRoleRepository";

interface IParams {
  id: number;
}

@injectable()
export class UpdateController implements IController<IParams, UpdateRoleDto> {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
  ) {}

  async invoke(
    request: CustomRequest<IParams, UpdateRoleDto, undefined>,
    response: Response
  ) {
    const { id } = request.params;

    const result = await this._roleRepository.save(id, request.body);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    return response.status(HTTP.NO_CONTENT).send();
  }
}
