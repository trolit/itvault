import { number } from "yup";

import { APP } from "@config";

// @DEPRECATED
export const pageSchema = number().required().integer().min(1);

export const pageSchemaV2 = number().optional().integer().min(1);

// @DEPRECATED
export const perPageSchema = number().required().integer().min(5);

export const perPageSchemaV2 = number()
  .optional()
  .integer()
  .min(5)
  .max(APP.MAX_ITEMS_PER_PAGE);
