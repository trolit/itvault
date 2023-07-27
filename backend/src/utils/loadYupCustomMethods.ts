import path from "path";
import fs from "fs-extra";

export const loadYupCustomMethods = async () => {
  const dir = path.join("dist", "helpers", "yup", "custom-methods");

  fs.readdir(dir, async (error, files) => {
    for (const file of files) {
      await import(`@helpers/yup/${file}`);
    }
  });
};
