import { Seeder } from "typeorm-extension";
import { DataSource, Repository } from "typeorm";

import {
  TEST_ACCOUNTS,
  TEST_LOCKED_WORKSPACE,
  TEST_UNLOCKED_WORKSPACE,
} from "./common";
import { User } from "@entities/User";
import { Workspace } from "@entities/Workspace";
import { HEAD_ADMIN_ROLE } from "@config/default-roles";
import { WorkspaceAccess } from "@enums/WorkspaceAccess";
import { UserToWorkspace } from "@entities/UserToWorkspace";

export class UserToWorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const workspaceRepository = dataSource.getRepository(Workspace);

    const userToWorkspaceRepository = dataSource.getRepository(UserToWorkspace);

    const headAdmin = TEST_ACCOUNTS.find(
      ({ roleName }) => HEAD_ADMIN_ROLE.name === roleName
    );

    if (!headAdmin) {
      return;
    }

    const user = await userRepository.findOneBy({
      email: headAdmin.email,
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
  const workspace = await workspaceRepository.findOneBy({
    name,
  });

  if (workspace) {
    await userToWorkspaceRepository.save({
      user,
      workspace,
      access: WorkspaceAccess.Write,
    });
  }
}
