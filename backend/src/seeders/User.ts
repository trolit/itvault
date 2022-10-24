import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { User } from "@entities/User";

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const repository = dataSource.getRepository(User);

    await repository.insert([
      {
        email: "admin@itvault.dev",
        password: "admin",
      },
    ]);

    const userFactory = factoryManager.get(User);

    await userFactory.saveMany(5);
  }
}
