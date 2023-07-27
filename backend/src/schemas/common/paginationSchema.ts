import { object, Schema, number } from "yup";

import { IPaginationQuery } from "@interfaces/IPaginationQuery";

export const paginationSchema: Schema<IPaginationQuery> = object({
  page: number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required()
    .min(1),

  perPage: number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required()
    .min(5),
});
