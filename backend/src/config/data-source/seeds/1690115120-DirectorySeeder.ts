import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { Directory } from "@entities/Directory";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
  FILES.ROOT,

  buildPath("src"),
  buildPath("assets"),
  buildPath("others"),

  buildPath("src/config"),
  buildPath("src/config/database"),
  buildPath("src/config/seeders/demo"),
  buildPath("src/config/seeders/development"),
  buildPath("src/config/seeders/production"),

  buildPath("src/models"),
  buildPath("src/helpers"),
  buildPath("src/factories"),

  buildPath("src/services"),
  buildPath("src/services/MailService"),
  buildPath("src/services/FileService"),
];

export default class DirectorySeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const directoryRepository = dataSource.getRepository(Directory);

    for (const relativePath of relativePaths) {
      const splitRelativePath = relativePath.split("/");
      const splitRelativePathLength = splitRelativePath.length;

      for (let index = 1; index < splitRelativePathLength; index++) {
        const part = splitRelativePath.slice(0, index + 1);

        await directoryRepository.upsert(
          {
            relativePath: part.join("/"),
          },
          { conflictPaths: ["relativePath"] }
        );
      }
    }
  }
}
