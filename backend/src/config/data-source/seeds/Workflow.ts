import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Workflow } from "@entities/Workflow";
import { TEST_LOCKED_WORKFLOW, TEST_UNLOCKED_WORKFLOW } from "./common";

export class WorkflowSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Workflow);

    const { name: TEST_UNLOCKED_WORKFLOW_NAME } = TEST_UNLOCKED_WORKFLOW;

    const unlockedWorkflow = await repository.findOneBy({
      name: TEST_UNLOCKED_WORKFLOW_NAME,
    });

    if (!unlockedWorkflow) {
      await repository.insert([
        {
          name: TEST_UNLOCKED_WORKFLOW_NAME,
        },
      ]);
    }

    const { name: TEST_LOCKED_WORKFLOW_NAME } = TEST_LOCKED_WORKFLOW;

    const lockedWorkflow = await repository.findOneBy({
      name: TEST_LOCKED_WORKFLOW_NAME,
    });

    if (!lockedWorkflow) {
      await repository.insert([
        {
          name: TEST_LOCKED_WORKFLOW_NAME,

          password: TEST_LOCKED_WORKFLOW.password,
        },
      ]);
    }
  }
}
