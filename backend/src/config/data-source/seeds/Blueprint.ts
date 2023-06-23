import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Seeder } from "typeorm-extension";

import { TEST_WORKSPACE_1 } from "./common";

import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";

export class BlueprintSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOneBy({
      name: TEST_WORKSPACE_1.name,
    });

    if (!workspace) {
      return;
    }

    const blueprintRepository = dataSource.getRepository(Blueprint);

    for (let index = 0; index < 3; index++) {
      await blueprintRepository.save({
        name: `Blueprint ${index + 1}`,
        color: faker.color.rgb({ format: "hex", casing: "upper" }),
        description: `Seed blueprint ${index + 1}`,
        workspace,
      });
    }
  }
}
