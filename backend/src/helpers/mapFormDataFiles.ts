import formidable from "formidable";

import { IFormDataFile } from "@interfaces/IFormDataFile";

export const mapFormDataFiles = (files: formidable.Files): IFormDataFile[] => {
  const result = [];

  for (const [key, value] of Object.entries(files)) {
    const arrayOfFiles = Array.isArray(value) ? value : [value];

    for (const file of arrayOfFiles) {
      result.push({
        key,
        file,
      });
    }
  }

  return result;
};
