import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { UserDto } from "@dtos/UserDto";
import { LoginDto } from "@dtos/LoginDto";
import { Environment } from "@enums/Environment";
import { IController } from "@interfaces/IController";
import { IAuthService } from "@interfaces/IAuthService";
import { NODE_ENV, JWT_TOKEN_COOKIE_KEY } from "@config";
import { IUserRepository } from "@interfaces/IUserRepository";
import { RequestOfType, ResponseOfType } from "@utilities/types";

@injectable()
export class LoginController implements IController {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IAuthService") private authService: IAuthService
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

    return response
      .cookie(JWT_TOKEN_COOKIE_KEY, token, {
        httpOnly: true,
        secure: NODE_ENV === Environment.Production,
      })
      .status(HTTP.OK)
      .send({ email });
  }
}
