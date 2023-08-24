import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { getRandomRecords } from "./common";

import { File } from "@entities/File";
import { Workspace } from "@entities/Workspace";
import { Directory } from "@entities/Directory";

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
