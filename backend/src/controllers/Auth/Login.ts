import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { LoginDto } from "dtos/Login";
import { User } from "@entities/User";
import { dataSource } from "@config/data-source";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";

export class LoginController implements IController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async invoke(
    request: Request<unknown, unknown, LoginDto>,
    response: Response<object, Record<string, object>>
  ) {
    const { email, password } = request.body;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    // TODO: verify encrypted password
    const hasValidPassword = user.password === password;

    if (!hasValidPassword) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    // TODO: company owner will refresh / set secret
    // TODO: add expiration
    const token = jwt.sign({ email }, "<< !! TEMPORARY SECRET !! >>");

    return response.status(HTTP.OK).send({ token });
  }
}
