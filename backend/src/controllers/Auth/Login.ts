import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes as HTTP } from "http-status-codes";

import { LoginDto } from "dtos/Login";
import { UserDto } from "@dtos/User";
import { User } from "@entities/User";
import { dataSource } from "@config/data-source";
import { Environment } from "@enums/Environment";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";
import { RequestOfType, ResponseOfType } from "@utilities/types";
import { JWT_SECRET_KEY, JWT_TOKEN_LIFETIME, NODE_ENV } from "@config";

export class LoginController implements IController {
  private _userRepository: UserRepository;

  constructor() {
    this._userRepository = dataSource.getRepository(User);
  }

  async invoke(
    request: RequestOfType<LoginDto>,
    response: ResponseOfType<UserDto>
  ) {
    const { email, password } = request.body;

    const user = await this._userRepository.findOneBy({ email });

    if (!user || user.deletedAt) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: JWT_TOKEN_LIFETIME,
    });

    return response
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === Environment.production,
      })
      .status(HTTP.OK)
      .send({ email });
  }
}
