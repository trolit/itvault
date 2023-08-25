import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { Directory } from "@entities/Directory";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
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

    const rootDirectory = await directoryRepository.save({
      relativePath: FILES.ROOT,
    });

    let lastDirectory: Directory = directoryRepository.create();

    for (const relativePath of relativePaths) {
      const splitRelativePath = relativePath.split("/");
      const splitRelativePathLength = splitRelativePath.length;

      for (let index = 1; index < splitRelativePathLength; index++) {
        const part = splitRelativePath.slice(0, index + 1);
        const joinedPart = part.join("/");

        const directory = await directoryRepository.findOne({
          where: { relativePath: joinedPart },
        });

        if (directory) {
          directory.parentDirectory =
            index === 1 ? rootDirectory : lastDirectory;

          await directoryRepository.save(directory);

          lastDirectory = directory;

          continue;
        }

        const result = await directoryRepository.save({
          relativePath: joinedPart,
          parentDirectory: index === 1 ? rootDirectory : lastDirectory,
        });

        lastDirectory = result;
      }
    }
  }
}
