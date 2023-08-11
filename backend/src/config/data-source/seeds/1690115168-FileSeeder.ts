import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { TEST_WORKSPACE_1, getRandomRecords } from "./common";

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

    const workspace = await workspaceRepository.findOne({
      where: {
        name: TEST_WORKSPACE_1.name,
      },
    });

    if (!workspace) {
      return;
    }

    for (let index = 0; index < 5; index++) {
      const [directory] = await getRandomRecords(directoryRepository, 1);

      const fileFactory = factoryManager.get(File);

      await fileFactory.save({
        workspace,
        directory,
      });
    }
  }
}
