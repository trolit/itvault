import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { File } from "@entities/File";
import { Workspace } from "@entities/Workspace";
import { TEST_UNLOCKED_WORKSPACE } from "./common";

export class FileSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOne({
      where: {
        name: TEST_UNLOCKED_WORKSPACE.name,
      },
    });

    if (!workspace) {
      return;
    }

    const fileFactory = factoryManager.get(File);

    await fileFactory.saveMany(8, {
      workspace,
    });
  }
}
