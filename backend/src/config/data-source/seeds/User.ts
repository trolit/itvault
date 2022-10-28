import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { BCRYPT_SALT_ROUNDS } from "@config";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { User } from "@entities/User";

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    const password = await bcrypt.hash("1234", BCRYPT_SALT_ROUNDS);

    await repository.insert([
      {
        email: "admin@itvault.dev",
        password,
      },
    ]);

    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(5, { password });
  }
}
