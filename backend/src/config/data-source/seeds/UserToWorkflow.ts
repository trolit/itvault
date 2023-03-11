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
import { UserToWorkflow } from "@entities/UserToWorkflow";

export class UserToWorkflowSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const workflowRepository = dataSource.getRepository(Workflow);

    const userToWorkflowRepository = dataSource.getRepository(UserToWorkflow);

    const user = await userRepository.findOneBy({
      email: TEST_ACCOUNT_EMAIL,
    });

    if (!user) {
      return;
    }

    await updateWorkflowBridge(
      workflowRepository,
      userToWorkflowRepository,
      user,
      TEST_UNLOCKED_WORKFLOW.name
    );

    await updateWorkflowBridge(
      workflowRepository,
      userToWorkflowRepository,
      user,
      TEST_LOCKED_WORKFLOW.name
    );
  }
}

async function updateWorkflowBridge(
  workflowRepository: Repository<Workflow>,
  userToWorkflowRepository: Repository<UserToWorkflow>,
  user: User,
  name: string
) {
  const workflow = await workflowRepository.findOneBy({
    name,
  });

  if (workflow) {
    await userToWorkflowRepository.save({
      user,
      workflow,
      access: WorkflowAccess.write,
    });
  }
}
