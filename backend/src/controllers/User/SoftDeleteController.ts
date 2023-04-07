import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { CustomRequest } from "@utils/types";
import { IController } from "@interfaces/IController";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IUserRepository } from "@interfaces/repository/IUserRepository";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

interface IParams {
  id: number;
}

@injectable()
export class SoftDeleteController implements IController<IParams> {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async invoke(request: CustomRequest<IParams>, response: Response) {
    const { id } = request.params;

    const result = await this._userRepository.softDeleteById(id);

    if (!result || !result.affected) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    await this._dataStoreService.delete(id, DataStoreKeyType.AuthenticatedUser);

    return response.status(HTTP.NO_CONTENT).send();
  }
}
