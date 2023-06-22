import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { getInstanceOf } from "./getInstanceOf";
import { CustomRequest } from "@custom-types/express";
import { IController } from "types/interfaces/IController";

// T-dependency, P-params, B-body, Q-query
export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = getInstanceOf(Controller) as IController<P, B, Q, void>;

    const [request, response] = args;

    controller.invoke(request, response);
  };
