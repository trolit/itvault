import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Directory } from "@db/entities/Directory";

import { FILES } from "@config";

const buildPath = (path: string) => FILES.ROOT.concat("/", path);

const relativePaths = [
  buildPath("src/config"),
  buildPath("src/jobs"),
  buildPath("src/models"),
  buildPath("src/helpers"),
  buildPath("src/components"),
  buildPath("src/services/dayjs"),
  buildPath("src/services/common"),
  buildPath("src/factories"),
  buildPath("src/middleware"),

  buildPath("src/seeders/demo"),
  buildPath("src/seeders/development"),
  buildPath("src/seeders/production"),

  buildPath("guide"),
  buildPath("docker"),
  buildPath("examples"),
  buildPath("documentation"),
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
