import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

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
    request: Request<unknown, unknown, User>,
    response: Response<string, Record<string, string>>
  ) {
    // TODO: create middleware to check if datasource connection is initialized

    const { email } = request.body;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    const token = jwt.sign({ email }, "<< !! TEMPORARY SECRET !! >>");

    return response.status(HTTP.OK).send(token);
  }
}
