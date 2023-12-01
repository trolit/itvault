import path from "path";
import fs from "fs-extra";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import { IFormidableFormFactory } from "types/factories/IFormidableFormFactory";

import { DIRS_TO_IGNORE_FROM_UPLOAD } from "@shared/constants/config";

export class FormidableFormFactory implements IFormidableFormFactory {
  public uploadDir: string;

  async create(options: {
    basePath: string;
    multiples: boolean;
    destination?: string;
    customFilterFlag?: boolean;
  }): Promise<IncomingForm> {
    const {
      basePath,
      multiples,
      destination,
      customFilterFlag = true,
    } = options;

    const uploadDir = path.join(basePath, destination || "");

    this.uploadDir = uploadDir;

    if (options.destination) {
      await fs.ensureDir(uploadDir);
    }

    const regex = new RegExp(/^[a-zA-Z0-9/._-]+$/);

    const filter = ({ name, originalFilename, mimetype }: formidable.Part) => {
      const path = originalFilename
        ? originalFilename.split("/").slice(0, -1).join("")
        : "";

      const isFromIgnoredDir = DIRS_TO_IGNORE_FROM_UPLOAD.some(dirToIgnore =>
        path.includes(dirToIgnore)
      );

      const withValidNamePattern = !!name && regex.test(name);

      // @TODO add more mimetype rules
      const isNotImage = !!mimetype && !mimetype.includes("image");

      const isNameWithoutDoubleSlash = !!name && !name.includes("//");

      return (
        !isFromIgnoredDir &&
        customFilterFlag &&
        isNotImage &&
        withValidNamePattern &&
        isNameWithoutDoubleSlash
      );
    };

    const form = formidable({
      filter,
      multiples,
      uploadDir,
      keepExtensions: true,
      allowEmptyFiles: false,
    });

    return form;
  }
}
