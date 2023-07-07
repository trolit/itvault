import { Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { IBaseController } from "@interfaces/IBaseController";
import { ControllerImplementation } from "miscellaneous-types";

export abstract class BaseController implements IBaseController {
  abstract implementations: ControllerImplementation[];

  public async invoke<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    response: Response
  ) {
    const {
      query: { version },
    } = request;

    if (!version) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const implementation = this.implementations.find(
      implementation => implementation.version === version
    );

    if (!implementation) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    return implementation.handle(request, response);
  }

  protected finalizeRequest<T>(
    response: CustomResponse<T>,
    code: HTTP,
    data?: T
  ) {
    if (!data) {
      return response.status(code).send();
    }

    // @TODO version information
    return response.status(code).send({ ...data, code: "1" });
  }
}
