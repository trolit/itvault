import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const isLimitNotReached = <P, B, Q>(
  repositoryName: Di,
  limit: number
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const repository = getInstanceOf<IBaseRepository<unknown>>(repositoryName);

    const [, total] = await repository.getAllAndCount({ skip: 0, take: 1 });

    if (total > limit) {
      return response
        .status(HTTP.BAD_REQUEST)
        .send(`Cannot create more entities. Limit (${limit}) reached!`);
    }

    return next();
  };
};
