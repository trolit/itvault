import { Seeder } from "typeorm-extension";
import { DataSource, Repository } from "typeorm";

import {
  TEST_ACCOUNT_EMAIL,
  TEST_LOCKED_WORKFLOW,
  TEST_UNLOCKED_WORKFLOW,
} from "./common";
import { User } from "@entities/User";
import { Workflow } from "@entities/Workflow";
import { WorkflowAccess } from "@enums/WorkflowAccess";

export class UserToWorkflowSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const workflowRepository = dataSource.getRepository(Workflow);

    const user = await userRepository.findOneBy({
      email: TEST_ACCOUNT_EMAIL,
    });

    if (!user) {
      return;
    }

    updateWorkflowBridge(
      workflowRepository,
      user.id,
      TEST_UNLOCKED_WORKFLOW.name
    );

    updateWorkflowBridge(
      workflowRepository,
      user.id,
      TEST_LOCKED_WORKFLOW.name
    );
  }
}

async function updateWorkflowBridge(
  repository: Repository<Workflow>,
  userId: number,
  name: string
) {
  const workflow = await repository.findOneBy({
    name,
  });

  if (workflow) {
    await repository.update(workflow, {
      userToWorkflows: [
        {
          userId,
          access: WorkflowAccess.write,
          workflowId: workflow.id,
        },
      ],
    });
  }
}
