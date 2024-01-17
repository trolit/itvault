import { string } from "yup";
import sanitizeHtml from "sanitize-html";

export const textSchema = string()
  .required()
  .transform(value => sanitizeHtml(value));
