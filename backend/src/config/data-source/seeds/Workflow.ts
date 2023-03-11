import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { BCRYPT_SALT_ROUNDS } from "@config";
import { Workflow } from "@entities/Workflow";
import { TEST_LOCKED_WORKFLOW, TEST_UNLOCKED_WORKFLOW } from "./common";

export class WorkflowSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Workflow);

    const password = await bcrypt.hash(
      TEST_LOCKED_WORKFLOW.password,
      BCRYPT_SALT_ROUNDS
    );

    await repository.save([
      {
        name: TEST_UNLOCKED_WORKFLOW.name,
      },
      {
        name: TEST_LOCKED_WORKFLOW.name,
        password,
      },
    ]);
  }
}
