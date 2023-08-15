import type { NextFunction, Response } from "express";
import { TransformedQueryFilters } from "types/controllers/TransformedQueryFilters";

import { IFilter } from "@shared/types/IFilter";
import { IFiltersQuery } from "@shared/types/IFiltersQuery";

type ParsedFiltersRequest<P, B, Q> = CustomRequest<
  P,
  B,
  Q & {
    filters: TransformedQueryFilters;
  }
>;

// @NOTE currently only substitutes the value (without find options)!!
export const transformFilters = <P, B, Q>(filterableFields: string[]) => {
  return async (
    request: CustomRequest<P, B, Q & { filters: IFiltersQuery }>,
    response: Response,
    next: NextFunction
  ) => {
    const {
      query: { filters },
    } = request;

    const castedRequest = <ParsedFiltersRequest<P, B, Q>>request;

    if (Array.isArray(filters)) {
      castedRequest.query.filters = filters.map(filter =>
        convertFilter(filterableFields, filter)
      );
    } else {
      castedRequest.query.filters = convertFilter(filterableFields, filters);
    }

    next();
  };
};

function convertFilter(filterableFields: string[], filter?: IFilter) {
  if (!filter || !filterableFields.includes(filter?.field)) {
    return undefined;
  }

  const appendToResult: any = (
    result: object,
    value: string,
    index: number,
    keys: string[]
  ) => {
    const currentKey = keys[index];

    if (index === keys.length - 1) {
      (result as any)[currentKey] = value;

      return;
    }

    (result as any)[currentKey] = {};

    return appendToResult((result as any)[currentKey], value, index + 1, keys);
  };

  const { field, value } = filter;

  const result = {};

  appendToResult(result, value, 0, field.split("."));

  return result;
}
