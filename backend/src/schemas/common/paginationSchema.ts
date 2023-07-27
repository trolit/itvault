import { object, Schema, number } from "yup";

import { IPaginationQuery } from "@interfaces/IPaginationQuery";

export const paginationSchema: Schema<IPaginationQuery> = object({
  page: number().required().integer().min(1),

  perPage: number().required().integer().min(5),
});
