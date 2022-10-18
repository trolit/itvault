import { injectable } from "tsyringe";
import { Request, Response } from "express";

import { User } from "@entities/User";
import { dataSource } from "@config/dataSource";
import { UserRepository } from "@repositories/UserRepository";

@injectable()
export class LoginController {
  constructor(private userRepository?: UserRepository) {
    this.userRepository = dataSource.getRepository(User);
  }

  async invoke(request: Request, response: Response) {
    // TODO: create middleware to check if datasource connection is initialized

    if (!this.userRepository) {
      return response.status(500).send();
    }

    const users = await this.userRepository.find();

    return response.status(200).send(users);
  }
}
