import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { File } from "@entities/File";
import { TEST_WORKSPACE_1 } from "./common";
import { Workspace } from "@entities/Workspace";

export class FileSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOne({
      where: {
        name: TEST_WORKSPACE_1.name,
      },
    });

    if (!workspace) {
      return;
    }

    const fileFactory = factoryManager.get(File);

    await fileFactory.saveMany(5, {
      workspace,
    });
  }
}
