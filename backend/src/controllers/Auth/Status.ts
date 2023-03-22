import { IsNull } from "typeorm";
import type { Request } from "express";
import { autoInjectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { UserDto } from "@dtos/User";
import { User } from "@entities/User";
import { AuthService } from "@services/Auth";
import { dataSource } from "@config/data-source";
import { ResponseOfType } from "@utilities/types";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";

@autoInjectable()
export class StatusController implements IController {
  private userRepository: UserRepository;

  constructor(private _authService?: AuthService) {
    this.userRepository = dataSource.getRepository(User);
  }

  async invoke(request: Request, response: ResponseOfType<UserDto>) {
    if (!this._authService) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const { token } = request.cookies;

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const result = this._authService.verifyToken(token);

    if (result.error) {
      response.clearCookie(JWT_TOKEN_COOKIE_KEY);

      return response.status(HTTP.FORBIDDEN).send();
    }

    const { email } = result.payload;

    const user = await this.userRepository.findOneBy({
      email,
      deletedAt: IsNull(),
    });

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return response.status(HTTP.OK).send({ email });
  }
}
