import type { NextFunction, Response } from "express";

import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export const transformPagination = (<P, B, Q extends IPaginationOptions>() => {
  return async (
    request: CustomRequest<P, B, Q & { page: string; perPage: string }>,
    response: Response,
    next: NextFunction
  ) => {
    const {
      query: { page, perPage },
    } = request;

    const parsedPage = parseInt(page);
    const parsedPerPage = parseInt(perPage);

    if (!isNaN(parsedPage) && !isNaN(parsedPerPage)) {
      request.query.skip =
        parsedPage === 1 ? 0 : (parsedPage - 1) * parsedPerPage;

      request.query.take = parsedPerPage > 20 ? 20 : parsedPerPage;
    }

    next();
  };
})();
