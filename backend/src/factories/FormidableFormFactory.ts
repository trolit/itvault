import path from "path";
import fs from "fs-extra";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";

import { FILES_LOCAL_STORAGE_BASE_PATH } from "@config";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export class FormidableFormFactory implements IFormidableFormFactory {
  async create(destination?: string): Promise<IncomingForm> {
    const uploadDir = path.join(
      FILES_LOCAL_STORAGE_BASE_PATH,
      destination || ""
    );

    if (destination) {
      await fs.ensureDir(uploadDir);
    }

    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir,
    });

    return form;
  }
}
