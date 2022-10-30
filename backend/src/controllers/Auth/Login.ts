import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes as HTTP } from "http-status-codes";

import { LoginDto } from "dtos/Login";
import { TokenDto } from "dtos/Token";
import { User } from "@entities/User";
import { dataSource } from "@config/data-source";
import { IController } from "@interfaces/IController";
import { RequestOfType, ResponseOfType } from "@utilities/types";
import { UserRepository } from "@repositories/UserRepository";

export class LoginController implements IController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async invoke(
    request: RequestOfType<LoginDto>,
    response: ResponseOfType<TokenDto>
  ) {
    const { email, password } = request.body;

    console.log("---");
    console.log(request.body);

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    // TODO: company owner will refresh / set secret
    // TODO: add expiration
    const token = jwt.sign({ email }, "<< !! TEMPORARY SECRET !! >>");

    return response.status(HTTP.OK).send({ token });
  }
}
