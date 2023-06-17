import path from "path";
import fs from "fs-extra";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";

import { FILES } from "@config";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export class FormidableFormFactory implements IFormidableFormFactory {
  async create(options: { destination?: string }): Promise<IncomingForm> {
    const uploadDir = path.join(
      FILES.STORAGE.BASE_UPLOADS_PATH,
      options.destination || ""
    );

    if (options.destination) {
      await fs.ensureDir(uploadDir);
    }

    const regex = new RegExp(/^[a-zA-Z0-9/._-]+$/);

    const filter = ({ name, originalFilename, mimetype }: formidable.Part) => {
      const withoutDoubleExtension =
        !!originalFilename && originalFilename.split(".").length === 2;

      const withValidNamePattern = !!name && regex.test(name);

      const isNotImage = !!mimetype && !mimetype.includes("image");

      const isNameWithoutDoubleSlash = !!name && !name.includes("//");

      return (
        isNotImage &&
        withValidNamePattern &&
        withoutDoubleExtension &&
        isNameWithoutDoubleSlash
      );
    };

    const form = formidable({
      filter,
      multiples: true,
      keepExtensions: true,
      uploadDir,
    });

    return form;
  }
}
