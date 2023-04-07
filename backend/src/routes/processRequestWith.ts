import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { CustomRequest } from "@utils/types";
import { instanceOf } from "@helpers/instanceOf";
import { IController } from "@interfaces/IController";

// T-dependency, P-params, B-body, Q-query
export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = instanceOf(Controller) as IController<P, B, Q, void>;

    const [request, response] = args;

    controller.invoke(request, response);
  };
