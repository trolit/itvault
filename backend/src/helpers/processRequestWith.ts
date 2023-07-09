import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { getInstanceOf } from "./getInstanceOf";

import { IBaseController } from "@interfaces/IBaseController";

export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = getInstanceOf(Controller) as IBaseController;

    const [request, response] = args;

    controller.invoke(request, response);
  };
