import { DataSource } from "typeorm";
import { User } from "@db/entities/User";
import { Role } from "@db/entities/Role";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ALL_PERMISSIONS_ROLE, NO_PERMISSIONS_ROLE } from "./roles";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const password = "1234";
    const userFactory = factoryManager.get(User);
    const roleRepository = dataSource.getRepository(Role);

    const [allPermissionsRole, noPermissionsRole] = await Promise.all([
      await roleRepository.findOneByOrFail({ name: ALL_PERMISSIONS_ROLE.name }),
      await roleRepository.findOneByOrFail({ name: NO_PERMISSIONS_ROLE.name }),
    ]);

    await userFactory.save({
      email: "all-permissions@itvault.com",
      password,
      role: allPermissionsRole,
      isSignedUp: true,
    });

    await userFactory.save({
      email: "no-permissions@itvault.com",
      password,
      role: noPermissionsRole,
      isSignedUp: true,
    });
  }
}
