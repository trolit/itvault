import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

export interface IParams {
  id: number;
}

export interface IBody {
  text: string;
}

@injectable()
export class UpdateController extends BaseController {
  constructor(
    @inject(Di.NoteRepository)
    private _noteRepository: INoteRepository
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

  async v1(request: CustomRequest<IParams, IBody>, response: Response) {
    const {
      params: { id },
      body: { text },
    } = request;

    const note = await this._noteRepository.getById(id);

    if (!note) {
      return response.status(HTTP.NOT_FOUND).send();
    }

    const isUpdated = await this._noteRepository.primitiveUpdate(
      { id },
      { value: text }
    );

    if (!isUpdated?.affected) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
