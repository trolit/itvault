import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Blueprint } from "@entities/Blueprint";
import { TEST_COMMON_BLUEPRINT } from "./common";

export class BlueprintSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Blueprint);

    const { name, color } = TEST_COMMON_BLUEPRINT;

    await repository.save({
      name,
      color,
      description: "Common blueprint. This blueprint cannot be removed.",
    });
  }
}
