import crypto from "crypto";
import bcrypt from "bcrypt";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { LoggedUserMapper } from "@mappers/LoggedUserMapper";
import { IUserRepository } from "types/repositories/IUserRepository";
import { IDataStoreService } from "types/services/IDataStoreService";
import { SignInControllerTypes } from "types/controllers/Auth/SignInController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { APP, JWT } from "@config";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";
import { Environment } from "@enums/Environment";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(
    request: SignInControllerTypes.v1.Request,
    response: SignInControllerTypes.v1.Response
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

    const sessionId = crypto.randomUUID();

    const token = this._authService.signIn({
      email,
      sessionId,
      id: user.id,
    });

    try {
      await this._dataStoreService.createHash<DataStore.User>(
        [sessionId, DataStore.KeyType.AuthenticatedUser],
        { id: user.id.toString() },
        { withTTL: { seconds: JWT.TOKEN_LIFETIME_IN_SECONDS } }
      );
    } catch (error) {
      log.error({
        error,
        message: `Failed to save ${sessionId} of user #${user.id}. Sign in request failed!!!`,
        service: Service.Redis,
      });

      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    response.cookie(JWT.COOKIE_KEY, token, {
      path: "/",
      httpOnly: true,
      secure: APP.ENV === Environment.Production,
    });

    const mappedUserData = this.mapper.map(user).to(LoggedUserMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedUserData);
  }
}
