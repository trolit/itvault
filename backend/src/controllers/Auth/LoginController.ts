import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import {
  NODE_ENV,
  JWT_TOKEN_COOKIE_KEY,
  JWT_TOKEN_LIFETIME_IN_SECONDS,
} from "@config";
import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { LoginDto } from "@dtos/LoginDto";
import { Environment } from "@enums/Environment";
import { DataStoreUser } from "@utils/DataStoreUser";
import { IController } from "@interfaces/IController";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IAuthService } from "@interfaces/service/IAuthService";
import { IUserRepository } from "@interfaces/repository/IUserRepository";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";
import { IEntityMapperService } from "@interfaces/service/IEntityMapperService";

@injectable()
export class LoginController
  implements IController<undefined, LoginDto, undefined, UserDto>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.AuthService)
    private _authService: IAuthService,
    @inject(Di.EntityMapperService)
    private _entityMapperService: IEntityMapperService,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async invoke(
    request: CustomRequest<undefined, LoginDto>,
    response: CustomResponse<UserDto>
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

    const mappedUserData = this._entityMapperService.mapOneToDto(
      user,
      UserDto,
      ({ role: { id, name, permissionToRole } }) => ({
        roleId: id,
        roleName: name,
        permissions: permissionToRole.map(({ enabled, permission }) => ({
          ...permission,
          enabled,
        })),
      })
    );

    try {
      await this._dataStoreService.createHash<DataStoreUser>(
        [user.id, DataStoreKeyType.AuthenticatedUser],
        { id: user.id.toString(), roleId: user.role.id.toString() },
        { withTTL: { seconds: JWT_TOKEN_LIFETIME_IN_SECONDS } }
      );
    } catch (error) {
      // @TODO log error
      console.error(error);

      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return response
      .cookie(JWT_TOKEN_COOKIE_KEY, token, {
        httpOnly: true,
        secure: NODE_ENV === Environment.Production,
      })
      .status(HTTP.OK)
      .send(mappedUserData);
  }
}
