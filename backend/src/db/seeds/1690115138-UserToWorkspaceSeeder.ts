import random from "lodash/random";
import { DataSource } from "typeorm";
import { User } from "@db/entities/User";
import { Seeder } from "typeorm-extension";
import { Workspace } from "@db/entities/Workspace";
import { UserToWorkspace } from "@db/entities/UserToWorkspace";

import { getRandomRecords } from "./helpers/getRandomRecords";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

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
        user => user.role.id === HEAD_ADMIN_ROLE.id
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
