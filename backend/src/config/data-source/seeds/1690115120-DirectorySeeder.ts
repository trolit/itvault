import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { Directory } from "@entities/Directory";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
  FILES.ROOT,
  buildPath("src"),
  buildPath("src/models"),
  buildPath("src/factories"),
  buildPath("src/config"),
  buildPath("src/config/database"),
  buildPath("scripts"),
  buildPath("others"),
  buildPath("demo"),
  buildPath("assets"),
  buildPath("libs"),
];

export default class DirectorySeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const directoryRepository = dataSource.getRepository(Directory);

    for (const relativePath of relativePaths) {
      await directoryRepository.save({
        relativePath,
      });
    }
  }
}
