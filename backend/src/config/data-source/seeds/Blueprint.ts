import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Blueprint } from "@entities/Blueprint";

export class BlueprintSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Blueprint);

    await repository.save({
      name: "Common",
      description: "Common blueprint. This blueprint cannot be removed.",
      color: "#C6CED1",
    });
  }
}
