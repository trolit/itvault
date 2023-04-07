import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { instanceOf } from "@helpers/instanceOf";
import { IController } from "@interfaces/IController";
import { CustomRequest } from "@utils/types";

export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = instanceOf(Controller) as IController<P, B, Q, void>;

    const [request, response] = args;

    controller.invoke(request, response);
  };
