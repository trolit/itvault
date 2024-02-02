import sample from "lodash/sample";
import { faker } from "@faker-js/faker";
import { File } from "@db/entities/File";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(File, () => {
  const file = new File();

  const filename = faker.system.commonFileName(
    sample(["txt", "js", "md", "html"])
  );

  file.originalFilename = filename;

  return file;
});
