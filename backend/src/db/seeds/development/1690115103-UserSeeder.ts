import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { User } from "@db/entities/User";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { roleNameToEmail } from "@db/seeds/helpers/roleNameToEmail";

import { INITIAL_ROLES } from "@config/initial-roles";

import { PASSWORD } from "@shared/constants/tests";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const userFactory = factoryManager.get(User);
    const roleRepository = dataSource.getRepository(Role);

    for (const { name } of INITIAL_ROLES) {
      const role = await roleRepository.findOneByOrFail({ name });

      await userFactory.save({
        email: roleNameToEmail(name),
        password: PASSWORD,
        role,
        isSignedUp: true,
      });

      if (name === HEAD_ADMIN_ROLE.name) {
        continue;
      }

      // some random users
      await userFactory.saveMany(3, {
        role,
        deletedAt: new Date(),
        isSignedUp: false,
      });
    }
  }
}
