import { FindOptionsWhere } from "typeorm";

export type TransformedQueryFilters<T = unknown> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[]
  | undefined;
