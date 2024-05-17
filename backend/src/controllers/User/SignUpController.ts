import bcrypt from "bcrypt";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { SignUpControllerTypes } from "types/controllers/User/SignUpController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { BCRYPT } from "@config";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SignUpController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(request: SignUpControllerTypes.v1.Request, response: Response) {
    const {
      body: { id, email, signUpCode, password },
    } = request;

    const user = await this._userRepository.getOne({
      where: {
        id,
        email,
        isSignedUp: false,
      },
    });

    if (!user) {
      return response.status(HTTP.NO_CONTENT).send();
    }

    if (user && user.signUpCode !== signUpCode) {
      await this._userRepository.primitiveSave({
        ...user,
        signUpCode: "",
      });

      return response.status(HTTP.NO_CONTENT).send();
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

    await this._userRepository.primitiveSave({
      ...user,
      signUpCode: "",
      password: hashedPassword,
      isSignedUp: true,
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
