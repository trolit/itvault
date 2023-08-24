import random from "lodash/random";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { getRandomRecords } from "./common";

import { User } from "@entities/User";
import { Workspace } from "@entities/Workspace";
import { UserToWorkspace } from "@entities/UserToWorkspace";

export default class UserToWorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const workspaceRepository = dataSource.getRepository(Workspace);
    const userToWorkspaceRepository = dataSource.getRepository(UserToWorkspace);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      const users = await getRandomRecords(userRepository, random(2, 5), [
        "role",
      ]);

      const headAdminUserIndex = users.findIndex(
        user => user.role.id === HEAD_ADMIN_ROLE_ID
      );

      if (~headAdminUserIndex) {
        users.splice(headAdminUserIndex, 1);
      }

      const userToWorkspace = users.map(user =>
        userToWorkspaceRepository.create({ user, workspace })
      );

      workspace.userToWorkspace = userToWorkspace;

      await workspaceRepository.save(workspace);
    }
  }
}
