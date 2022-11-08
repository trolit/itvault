import bcrypt from "bcrypt";
import { StatusCodes as HTTP } from "http-status-codes";

import { NODE_ENV } from "@config";
import { LoginDto } from "dtos/Login";
import { UserDto } from "@dtos/User";
import { User } from "@entities/User";
import { AuthService } from "@services/Auth";
import { dataSource } from "@config/data-source";
import { Environment } from "@enums/Environment";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";
import { RequestOfType, ResponseOfType } from "@utilities/types";

export class LoginController implements IController {
  private _userRepository: UserRepository;

  constructor(private authService?: AuthService) {
    this._userRepository = dataSource.getRepository(User);
  }

  async invoke(
    request: RequestOfType<LoginDto>,
    response: ResponseOfType<UserDto>
  ) {
    if (!this.authService) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const { email, password } = request.body;

    const user = await this._userRepository.findOneBy({ email });

    if (!user || user.deletedAt) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = this.authService.signToken({ email });

    return response
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === Environment.production,
      })
      .status(HTTP.OK)
      .send({ email });
  }
}
