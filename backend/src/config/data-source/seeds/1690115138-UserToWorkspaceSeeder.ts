import { Seeder } from "typeorm-extension";
import { DataSource, Repository } from "typeorm";

import { HEAD_ADMIN_ROLE } from "@config/default-roles";

import { TEST_ACCOUNTS, TEST_WORKSPACE_2, TEST_WORKSPACE_1 } from "./common";

import { User } from "@entities/User";
import { Workspace } from "@entities/Workspace";
import { UserToWorkspace } from "@entities/UserToWorkspace";

export default class UserToWorkspaceSeeder implements Seeder {
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
      TEST_WORKSPACE_1.name
    );

    await updateUserToWorkspaceBridge(
      workspaceRepository,
      userToWorkspaceRepository,
      user,
      TEST_WORKSPACE_2.name
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
    });
  }
}
