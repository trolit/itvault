import yup, { Schema } from "yup";

import { IPaginationQuery } from "@interfaces/IPaginationQuery";

export const paginationSchema: Schema<IPaginationQuery> = yup
  .object({
    page: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required()
      .min(1),

    perPage: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required()
      .min(5),
  })
  .defined();
