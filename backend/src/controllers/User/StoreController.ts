import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { AddEditUserDto } from "@dtos/AddEditUserDto";
import { ControllerImplementation } from "miscellaneous-types";
import { MailConsumerHandlerData } from "consumer-handlers-types";
import { SignUpMailViewBuilder as VB } from "mail-view-builders-types";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { sendToQueue } from "@helpers/sendToQueue";
import { generateCode } from "@helpers/generateCode";
import { SignUpMailViewBuilder } from "@services/MailService/view-builders/SignUpMailViewBuilder";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StoreController extends BaseController {
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

  async v1(
    request: CustomRequest<undefined, AddEditUserDto>,
    response: Response
  ) {
    const {
      userId,
      body: { email, firstName, lastName, roleId },
    } = request;

    const user = await this._userRepository.primitiveSave({
      email,
      firstName,
      lastName,
      role: {
        id: roleId,
      },
      createdBy: {
        id: userId,
      },
      signUpCode: generateCode(),
    });

    if (!user) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    sendToQueue<MailConsumerHandlerData<VB.Input>>(Queue.SendMail, {
      user,
      sendTo: user.email,
      subject: `itvault - invitation to application`,
      viewBuilderName: SignUpMailViewBuilder.name,
    });

    return this.finalizeRequest(response, HTTP.CREATED, user);
  }
}
