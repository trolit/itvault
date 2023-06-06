import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import { faker } from "@faker-js/faker";

import { FILES } from "@config";

export async function createFile(
  workspaceId: number,
  filename: string,
  extension: string
) {
  const uploadDir = path.join(
    FILES.STORAGE.LOCAL.BASE_PATH,
    `workspace-${workspaceId}`
  );

  await fs.ensureDir(uploadDir);

  const fileDir = path.join(uploadDir, filename);

  const fileContent = getFileContent(extension);

  await fs.writeFile(path.join(uploadDir, filename), fileContent);

  const fileStats = await fs.stat(fileDir);

  return fileStats.size;
}

function getFileContent(extension: string) {
  const value = random(3, 15);

  const rawContent = [];

  const caller =
    extension === "js" ? faker.hacker.phrase : faker.word.adjective;

  for (let index = 0; index < value; index++) {
    rawContent.push(caller());
  }

  return rawContent.join("\n");
}
