import { string } from "yup";
import sanitizeHtml from "sanitize-html";

export const useTextSchema = (maxLength: number) =>
  string()
    .required()
    .transform(value => sanitizeHtml(value))
    .max(maxLength);
