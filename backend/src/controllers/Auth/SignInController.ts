import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { DataStoreKeyType, DataStoreUser } from "data-store-types";
import { Request, Response } from "types/controllers/v1/Auth/SignInController";

import { APP, JWT } from "@config";

import { Di } from "@enums/Di";
import { Environment } from "@enums/Environment";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IAuthService } from "@interfaces/services/IAuthService";
import { IDataStoreService } from "@interfaces/services/IDataStoreService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SignInController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.AuthService)
    private _authService: IAuthService,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
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

  async v1(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await this._userRepository.findByEmail(email, {
      includePermissions: true,
    });

    if (!user || !user?.password) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = this._authService.signIn({ email, id: user.id });

    try {
      await this._dataStoreService.createHash<DataStoreUser>(
        [user.id, DataStoreKeyType.AuthenticatedUser],
        { id: user.id.toString(), roleId: user.role.id.toString() },
        { withTTL: { seconds: JWT.TOKEN_LIFETIME_IN_SECONDS } }
      );
    } catch (error) {
      console.error(error);

      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    response.cookie(JWT.COOKIE_KEY, token, {
      httpOnly: true,
      secure: APP.ENV === Environment.Production,
    });

    const mappedUserData = this.mapper.mapOneToDto(user, LoggedUserMapDto);

    return this.finalizeRequest(response, HTTP.OK, mappedUserData);
  }
}
