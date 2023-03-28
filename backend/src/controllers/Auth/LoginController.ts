import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { LoginDto } from "@dtos/LoginDto";
import { Environment } from "@enums/Environment";
import { IController } from "@interfaces/IController";
import { IAuthService } from "@interfaces/IAuthService";
import { NODE_ENV, JWT_TOKEN_COOKIE_KEY } from "@config";
import { IRedisService } from "@interfaces/IRedisService";
import { IUserRepository } from "@interfaces/IUserRepository";
import { CustomRequest, CustomResponse } from "@utilities/types";
import { IEntityMapperService } from "@interfaces/IEntityMapperService";

@injectable()
export class LoginController
  implements IController<unknown, LoginDto, UserDto>
{
  constructor(
    @inject(Di.UserRepository) private userRepository: IUserRepository,
    @inject(Di.AuthService) private authService: IAuthService,
    @inject(Di.EntityMapperService)
    private entityMapperService: IEntityMapperService,
    @inject(Di.RedisService) private redisService: IRedisService
  ) {}

  async invoke(
    request: CustomRequest<LoginDto>,
    response: CustomResponse<UserDto>
  ) {
    const { email, password } = request.body;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = this.authService.signToken({ email, id: user.id });

    const mappedUserData = this.entityMapperService.mapOneToDto(
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
      await this.redisService.setKey(
        user.id.toString(),
        JSON.stringify(mappedUserData)
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
