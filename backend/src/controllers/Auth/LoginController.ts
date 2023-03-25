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
import { IUserRepository } from "@interfaces/IUserRepository";
import { RequestOfType, ResponseOfType } from "@utilities/types";
import { IEntityMapperService } from "@interfaces/IEntityMapperService";

@injectable()
export class LoginController implements IController {
  constructor(
    @inject(Di.UserRepository) private userRepository: IUserRepository,
    @inject(Di.AuthService) private authService: IAuthService,
    @inject(Di.EntityMapperService)
    private entityMapperService: IEntityMapperService
  ) {}

  async invoke(
    request: RequestOfType<LoginDto>,
    response: ResponseOfType<UserDto>
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

    const mappedUser = this.entityMapperService.mapOneToDto(
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

    return response
      .cookie(JWT_TOKEN_COOKIE_KEY, token, {
        httpOnly: true,
        secure: NODE_ENV === Environment.Production,
      })
      .status(HTTP.OK)
      .send(mappedUser);
  }
}
