import bcrypt from "bcrypt";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { BCRYPT } from "@config";

import { Di } from "@enums/Di";
import { SignUpDto } from "@dtos/SignUpDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: CustomRequest<undefined, SignUpDto>, response: Response) {
    const {
      body: { id, email, registrationCode, password },
    } = request;

    const user = await this._userRepository.getOne({
      where: {
        id,
        email,
        isRegistrationFinished: false,
      },
    });

    if (!user) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    if (user && user.registrationCode !== registrationCode) {
      await this._userRepository.primitiveSave({
        ...user,
        registrationCode: "",
      });

      return response.status(HTTP.BAD_REQUEST).send();
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

    await this._userRepository.primitiveSave({
      ...user,
      registrationCode: "",
      password: hashedPassword,
      isRegistrationFinished: true,
    });

    return this.finalizeRequest(response, HTTP.OK);
  }
}
