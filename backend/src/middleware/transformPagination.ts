import type { NextFunction, Response } from "express";
import { IPaginationOptions } from "types/IPaginationOptions";

import { IPaginationQuery } from "@shared/types/IPaginationQuery";

export const transformPagination = <
  P,
  B,
  Q extends IPaginationQuery
>(options?: {
  perPage?: number;
}) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const {
      query: { page, perPage },
    } = request;

    const fixedPerPage = options?.perPage ? options.perPage : perPage;

    const castedRequest = <CustomRequest<P, B, Q & IPaginationOptions>>request;

    castedRequest.query.skip = page === 1 ? 0 : (page - 1) * fixedPerPage;

    castedRequest.query.take = fixedPerPage > 20 ? 20 : fixedPerPage;

    next();
  };
};
