import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { BCRYPT_SALT_ROUNDS } from "@config";
import { TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASSWORD } from "./common";
import { HEAD_ADMIN_ROLE_NAME, MEMBER_ROLE } from "@config/default-roles";

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const userRepository = dataSource.getRepository(User);

    const roleRepository = dataSource.getRepository(Role);

    const headAdminRole = await roleRepository.findOneBy({
      name: HEAD_ADMIN_ROLE_NAME,
    });

    const password = await bcrypt.hash(
      TEST_ACCOUNT_PASSWORD,
      BCRYPT_SALT_ROUNDS
    );

    if (headAdminRole) {
      await userRepository.save({
        email: TEST_ACCOUNT_EMAIL,
        password,
        role: headAdminRole,
      });
    }

    const memberRole = await roleRepository.findOneBy({
      name: MEMBER_ROLE.name,
    });

    if (memberRole) {
      const userFactory = factoryManager.get(User);

      await userFactory.saveMany(3, { password, role: memberRole });

      await userFactory.saveMany(3, {
        password,
        role: memberRole,
        deletedAt: new Date(),
      });
    }
  }
}
