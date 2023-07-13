import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { DataStoreKeyType, DataStoreUser } from "data-store-types";

import { APP, JWT } from "@config";

import { Di } from "@enums/Di";
import { LoginDto } from "@dtos/LoginDto";
import { Environment } from "@enums/Environment";
import { LoggedUserMapDto } from "@dtos/LoggedUserMapDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IAuthService } from "@interfaces/services/IAuthService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";
import { IDataStoreService } from "@interfaces/services/IDataStoreService";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class LoginController extends BaseController {
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

  async v1(
    request: CustomRequest<undefined, LoginDto>,
    response: CustomResponse<LoggedUserMapDto>
  ) {
    const { email, password } = request.body;

    const user = await this._userRepository.findByEmail(email, {
      includePermissions: true,
    });

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = this._authService.signIn({ email, id: user.id });

    const mappedUserData = this.mapper.mapOneToDto(user, LoggedUserMapDto);

    try {
      await this._dataStoreService.createHash<DataStoreUser>(
        [user.id, DataStoreKeyType.AuthenticatedUser],
        { id: user.id.toString(), roleId: user.role.id.toString() },
        { withTTL: { seconds: JWT.TOKEN_LIFETIME_IN_SECONDS } }
      );
    } catch (error) {
      // @TODO log error
      console.error(error);

      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    response.cookie(JWT.COOKIE_KEY, token, {
      httpOnly: true,
      secure: APP.ENV === Environment.Production,
    });

    return this.finalizeRequest(response, HTTP.OK, mappedUserData);
  }
}
