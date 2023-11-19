import path from "path";
import fs from "fs-extra";

import { APP } from "@config/index";

import "@helpers/yup/internal-messages";

export const loadYupUtils = async () => {
  const dir = path.join(APP.WORKING_DIR, "helpers", "yup", "custom-methods");

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      await import(`@helpers/yup/custom-methods/${file}`);
    }
  });
};
