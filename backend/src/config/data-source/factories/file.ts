import sample from "lodash/sample";
import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { FILES } from "@config";
import { File } from "@entities/File";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
  FILES.ROOT,
  buildPath("src"),
  buildPath("src/tools"),
  buildPath("src/documents"),
  buildPath("src/config"),
  buildPath("src/config/dump"),
  buildPath("setup"),
  buildPath("others"),
  buildPath("demo"),
  buildPath("assets"),
];

export const file = setSeederFactory(File, () => {
  const file = new File();

  const filename = faker.system.commonFileName();

  file.originalFilename = filename;

  file.relativePath = sample(relativePaths) || FILES.ROOT;

  return file;
});
