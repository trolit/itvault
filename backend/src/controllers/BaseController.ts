import { Request, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { ControllerImplementation } from "miscellaneous-types";

export abstract class BaseController {
  abstract implementations: ControllerImplementation[];

  async invoke(request: Request, response: Response) {
    const {
      query: { version },
    } = request;

    if (!version || typeof version !== "string") {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const implementation = this.implementations.find(
      implementation => implementation.version === parseFloat(version)
    );

    if (!implementation) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return implementation.handler(request, response);
  }
}
