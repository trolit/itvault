import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";

export const checkEndpointVersion = (versions: string[]) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { version } = request.query;

    if (!version || isNaN(+version)) {
      return response
        .status(HTTP.BAD_REQUEST)
        .send(
          `Wrong resource version, requested -> ${version}, found -> ${versions.join(
            ","
          )}`
        );
    }

    next();
  };
};
