import path from "path";
import formidable from "formidable";

import { FILES_LOCAL_STORAGE_BASE_PATH } from "@config";

export class FormidableFormFactory {
  create(destination?: string) {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: destination
        ? path.join(FILES_LOCAL_STORAGE_BASE_PATH, destination)
        : FILES_LOCAL_STORAGE_BASE_PATH,
    });

    return form;
  }
}
