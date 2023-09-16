import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { Directory } from "@entities/Directory";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
  buildPath("src"),

  buildPath("src/models"),
  buildPath("src/helpers"),
  buildPath("src/services"),
  buildPath("src/factories"),

  buildPath("src/config"),
  buildPath("src/config/database"),
  buildPath("src/config/seeders/demo"),
  buildPath("src/config/seeders/development"),
  buildPath("src/config/seeders/production"),

  buildPath("assets"),
  buildPath("examples"),
  buildPath("documentation"),
];

export default class DirectorySeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const directoryRepository = dataSource.getRepository(Directory);

    const rootDirectory = await directoryRepository.save({
      relativePath: FILES.ROOT,
    });

    for (const relativePath of relativePaths) {
      const splitRelativePath = relativePath.split("/");
      const splitRelativePathLength = splitRelativePath.length;

      let previousDirectory: Directory = rootDirectory;

      for (let index = 1; index < splitRelativePathLength; index++) {
        const part = splitRelativePath.slice(0, index + 1);
        const relativePathToSave = part.join("/");

        const directory = await directoryRepository.findOne({
          where: { relativePath: relativePathToSave },
        });

        if (directory) {
          directory.parentDirectory = previousDirectory;

          await directoryRepository.save(directory);

          previousDirectory = directory;

          continue;
        }

        const result = await directoryRepository.save({
          relativePath: relativePathToSave,
          parentDirectory: previousDirectory,
        });

        previousDirectory = result;
      }
    }
  }
}
