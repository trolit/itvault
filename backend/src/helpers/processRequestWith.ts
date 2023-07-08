import { Response } from "express";
import { InjectionToken } from "tsyringe";

import { getInstanceOf } from "./getInstanceOf";

import { IController } from "@interfaces/IController";
import { IBaseController } from "@interfaces/IBaseController";

// @DEPRECATED
export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = getInstanceOf(Controller) as IController<P, B, Q, void>;

    const [request, response] = args;

    controller.invoke(request, response);
  };

export const processRequestWith2 =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = getInstanceOf(Controller) as IBaseController;

    const [request, response] = args;

    controller.invoke(request, response);
  };
