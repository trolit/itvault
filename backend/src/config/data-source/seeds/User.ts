import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { MEMBER_ROLE } from "@config/default-roles";

import { PASSWORD, TEST_ACCOUNTS } from "./common";

import { Role } from "@entities/Role";
import { User } from "@entities/User";

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const roleRepository = dataSource.getRepository(Role);

    const userFactory = factoryManager.get(User);

    for (const { email, roleName } of TEST_ACCOUNTS) {
      const role = await roleRepository.findOneBy({ name: roleName });

      if (!role) {
        continue;
      }

      await userFactory.save({
        email,
        password: PASSWORD,
        role,
        isSignedUp: true,
      });

      if (role.name === MEMBER_ROLE.name) {
        await userFactory.saveMany(4, {
          role,
          deletedAt: new Date(),
          isSignedUp: false,
        });
      }
    }
  }
}
