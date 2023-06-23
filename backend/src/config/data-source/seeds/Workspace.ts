import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { TEST_WORKSPACE_2, TEST_WORKSPACE_1 } from "./common";

import { Workspace } from "@entities/Workspace";

export class WorkspaceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceFactory = factoryManager.get(Workspace);

    await workspaceFactory.save({
      name: TEST_WORKSPACE_1.name,
    });

    await workspaceFactory.save({
      name: TEST_WORKSPACE_2.name,
    });
  }
}
