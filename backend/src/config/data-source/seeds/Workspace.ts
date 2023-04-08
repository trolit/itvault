import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import {
  PASSWORD,
  TEST_LOCKED_WORKSPACE,
  TEST_UNLOCKED_WORKSPACE,
} from "./common";
import { Workspace } from "@entities/Workspace";

export class WorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Workspace);

    await repository.save([
      {
        name: TEST_UNLOCKED_WORKSPACE.name,
      },
      {
        name: TEST_LOCKED_WORKSPACE.name,
        password: PASSWORD,
      },
    ]);
  }
}
