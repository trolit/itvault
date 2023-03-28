import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { instanceOf } from "@helpers/instanceOf";
import { IController } from "@interfaces/IController";
import { CustomRequest } from "@utilities/types";

export const processRequestWith =
  <T, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<B, Q>, Response]) => {
    const controller = instanceOf(Controller) as IController<B, Q, void>;

    const [request, response] = args;

    controller.invoke(request, response);
  };
