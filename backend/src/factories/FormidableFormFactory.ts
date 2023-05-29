import path from "path";
import fs from "fs-extra";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";

import { FILES_LOCAL_STORAGE_BASE_PATH } from "@config";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export class FormidableFormFactory implements IFormidableFormFactory {
  async create(options: {
    destination?: string;
    filter?: (part: formidable.Part) => boolean;
  }): Promise<IncomingForm> {
    const uploadDir = path.join(
      FILES_LOCAL_STORAGE_BASE_PATH,
      options.destination || ""
    );

    if (options.destination) {
      await fs.ensureDir(uploadDir);
    }

    const form = formidable({
      filter: options.filter,
      multiples: true,
      keepExtensions: true,
      uploadDir,
    });

    return form;
  }
}
