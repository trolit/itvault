import { Request, Response } from "express";

import { User } from "@entities/User";
import { dataSource } from "@config/dataSource";
import { IController } from "@interfaces/IController";
import { UserRepository } from "@repositories/UserRepository";

export class LoginController implements IController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async invoke(
    request: Request,
    response: Response<number, Record<string, number>>
  ) {
    // TODO: create middleware to check if datasource connection is initialized

    const users = await this.userRepository.find();

    return response.status(200).send(1);
  }
}
