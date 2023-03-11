import { Seeder } from "typeorm-extension";
import { DataSource, Repository } from "typeorm";

import {
  TEST_ACCOUNT_EMAIL,
  TEST_LOCKED_WORKSPACE,
  TEST_UNLOCKED_WORKSPACE,
} from "./common";
import { User } from "@entities/User";
import { Workspace } from "@entities/Workspace";
import { WorkspaceAccess } from "@enums/WorkspaceAccess";
import { UserToWorkspace } from "@entities/UserToWorkspace";

export class UserToWorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const workspaceRepository = dataSource.getRepository(Workspace);

    const userToWorkspaceRepository = dataSource.getRepository(UserToWorkspace);

    const user = await userRepository.findOneBy({
      email: TEST_ACCOUNT_EMAIL,
    });

    if (!user) {
      return;
    }

    await updateUserToWorkspaceBridge(
      workspaceRepository,
      userToWorkspaceRepository,
      user,
      TEST_UNLOCKED_WORKSPACE.name
    );

    await updateUserToWorkspaceBridge(
      workspaceRepository,
      userToWorkspaceRepository,
      user,
      TEST_LOCKED_WORKSPACE.name
    );
  }
}

async function updateUserToWorkspaceBridge(
  workspaceRepository: Repository<Workspace>,
  userToWorkspaceRepository: Repository<UserToWorkspace>,
  user: User,
  name: string
) {
  const workflow = await workspaceRepository.findOneBy({
    name,
  });

  if (workflow) {
    await userToWorkspaceRepository.save({
      user,
      workflow,
      access: WorkspaceAccess.write,
    });
  }
}
