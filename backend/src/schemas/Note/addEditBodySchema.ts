import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { Resource } from "@enums/Resource";

export const addEditBodySchema = object({
  id: useResourceEntityTest(),
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
  resource: string().required().oneOf([Resource.File]),
});
