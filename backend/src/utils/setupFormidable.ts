import formidable from "formidable";
import { FILES_LOCAL_STORAGE_PATH } from "@config";

export const setupFormidable = () => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: FILES_LOCAL_STORAGE_PATH,
  });

  return form;
};
