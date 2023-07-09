import { Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { IBaseController } from "@interfaces/IBaseController";
import { ControllerImplementation } from "miscellaneous-types";

export abstract class BaseController implements IBaseController {
  static ALL_VERSION_DEFINITIONS = {
    v1_0: 1,
    v1_1: 1.1,
    v2_0: 2,
    v2_1: 2.1,
  };

  abstract implementations: ControllerImplementation[];

  usedVersion: number;

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

    this.usedVersion = implementation.version;

    return implementation.handle(request, response);
  }

  protected finalizeRequest<T>(
    response: CustomResponse<T>,
    code: HTTP,
    data?: T
  ): CustomResponse<T> {
    const versions = this.implementations
      .filter(({ version }) => version !== this.usedVersion)
      .map(({ version, details }) => ({ version, details }));

    if (!data) {
      return response.status(code).send();
    }

    if (!versions.length) {
      return response.status(code).send(data);
    }

    return response.status(code).send({ ...data, versions });
  }
}
