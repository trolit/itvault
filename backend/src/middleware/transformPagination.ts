import type { NextFunction, Response } from "express";

import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export const transformPagination = (<P, B, Q extends IPaginationOptions>() => {
  return async (
    request: CustomRequest<P, B, Q & { page: number; perPage: number }>,
    response: Response,
    next: NextFunction
  ) => {
    const {
      query: { page, perPage },
    } = request;

    request.query.skip = page === 1 ? 0 : (page - 1) * perPage;

    request.query.take = perPage > 20 ? 20 : perPage;

    next();
  };
})();
