import path from "path";
import fs from "fs-extra";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";

import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export class FormidableFormFactory implements IFormidableFormFactory {
  public uploadDir: string;

  async create(options: {
    basePath: string;
    multiples: boolean;
    destination?: string;
  }): Promise<IncomingForm> {
    const { basePath, destination, multiples } = options;

    const uploadDir = path.join(basePath, destination || "");

    this.uploadDir = uploadDir;

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
      multiples,
      uploadDir,
      keepExtensions: true,
    });

    return form;
  }
}
