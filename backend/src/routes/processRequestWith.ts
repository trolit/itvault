import { InjectionToken } from "tsyringe";
import { Request, Response } from "express";

import { instanceOf } from "@helpers/instanceOf";
import { IController } from "@interfaces/IController";

export const processRequestWith =
  <T>(ControllerType: InjectionToken<T>) =>
  (...args: [Request, Response]) => {
    const controller = instanceOf(ControllerType) as IController;

    const [request, response] = args;

    controller.invoke(request, response);
  };
