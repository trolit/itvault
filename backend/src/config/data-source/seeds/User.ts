import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { User } from "@entities/User";
import { BCRYPT_SALT_ROUNDS } from "@config";
import { TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASSWORD } from "./common";

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const password = await bcrypt.hash(
      TEST_ACCOUNT_PASSWORD,
      BCRYPT_SALT_ROUNDS
    );

    await repository.insert([
      {
        email: TEST_ACCOUNT_EMAIL,
        password,
      },
    ]);

    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(5, { password });
  }
}
