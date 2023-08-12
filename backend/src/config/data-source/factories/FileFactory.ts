import sample from "lodash/sample";
import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { File } from "@entities/File";

export default setSeederFactory(File, () => {
  const file = new File();

  const filename = faker.system.commonFileName(
    sample(["txt", "js", "md", "html"])
  );

  file.originalFilename = filename;

  return file;
});
