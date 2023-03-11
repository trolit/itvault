import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { BCRYPT_SALT_ROUNDS } from "@config";
import { Workspace } from "@entities/Workspace";
import { TEST_LOCKED_WORKSPACE, TEST_UNLOCKED_WORKSPACE } from "./common";

export class WorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Workspace);

    const password = await bcrypt.hash(
      TEST_LOCKED_WORKSPACE.password,
      BCRYPT_SALT_ROUNDS
    );

    await repository.save([
      {
        name: TEST_UNLOCKED_WORKSPACE.name,
      },
      {
        name: TEST_LOCKED_WORKSPACE.name,
        password,
      },
    ]);
  }
}
