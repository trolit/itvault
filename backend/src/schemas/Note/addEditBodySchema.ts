import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { NoteResource } from "@shared/types/enums/NoteResource";

export const addEditBodySchema = object({
  id: useResourceEntityTest(),
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
  resource: string().required().oneOf([NoteResource.File]),
});
