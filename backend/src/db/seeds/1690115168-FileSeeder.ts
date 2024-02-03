import { DataSource } from "typeorm";
import { File } from "@db/entities/File";
import { Directory } from "@db/entities/Directory";
import { Workspace } from "@db/entities/Workspace";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { getRandomRecords } from "./helpers/getRandomRecords";

export default class FileSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceRepository = dataSource.getRepository(Workspace);
    const directoryRepository = dataSource.getRepository(Directory);

    const workspaces = await workspaceRepository.find();

    const fileFactory = factoryManager.get(File);

    for (const workspace of workspaces) {
      for (let index = 0; index < 5; index++) {
        const [directory] = await getRandomRecords(directoryRepository, 1);

        await fileFactory.save({
          directory,
          workspace,
        });
      }
    }
  }
}
