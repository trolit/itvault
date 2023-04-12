import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import {
  PASSWORD,
  TEST_LOCKED_WORKSPACE,
  TEST_UNLOCKED_WORKSPACE,
} from "./common";
import { Workspace } from "@entities/Workspace";

export class WorkspaceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceFactory = factoryManager.get(Workspace);

    await workspaceFactory.save({
      name: TEST_UNLOCKED_WORKSPACE.name,
    });

    await workspaceFactory.save({
      name: TEST_LOCKED_WORKSPACE.name,
      password: PASSWORD,
    });
  }
}
