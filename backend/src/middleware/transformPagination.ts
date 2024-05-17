import type { NextFunction, Response } from "express";
import { IPaginationOptions } from "types/IPaginationOptions";

import { IPaginationQuery } from "@shared/types/IPaginationQuery";

export const transformPagination = <P, B, Q extends Partial<IPaginationQuery>>(
  options: {
    defaultPerPage: number;
  } = { defaultPerPage: 5 }
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const { defaultPerPage } = options;

    const {
      query: { page, perPage },
    } = request;

    const perPageValue = perPage ?? defaultPerPage;

    const castedRequest = <CustomRequest<P, B, Q & IPaginationOptions>>request;

    if (page && page > 1) {
      castedRequest.query.skip = (page - 1) * perPageValue;
    } else {
      castedRequest.query.skip = 0;
    }

    castedRequest.query.take = perPageValue;

    next();
  };
};
