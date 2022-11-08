import { IsNull } from "typeorm";
import type { Request } from "express";
import { autoInjectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { User } from "@entities/User";
import { AuthService } from "@services/Auth";
import { dataSource } from "@config/data-source";
import { JwtPayloadDto } from "@dtos/JwtPayload";
import { ResponseOfType } from "@utilities/types";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";

@autoInjectable()
export class StatusController implements IController {
  private _userRepository: UserRepository;

  constructor(private authService?: AuthService) {
    this._userRepository = dataSource.getRepository(User);
  }

  async invoke(request: Request, response: ResponseOfType<boolean>) {
    if (!this.authService) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const { token } = request.cookies;

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const isValid = this.authService.isTokenValid(token);

    if (!isValid) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const decodedToken = this.authService.decodeToken(token);

    if (!decodedToken) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const payload = decodedToken.payload as JwtPayloadDto;

    const user = await this._userRepository.findOneBy({
      email: payload.email,
      deletedAt: IsNull(),
    });

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return response.status(HTTP.OK).send();
  }
}
