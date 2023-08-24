import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Seeder } from "typeorm-extension";

import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";

export default class BlueprintSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);
    const blueprintRepository = dataSource.getRepository(Blueprint);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      for (let index = 0; index < 20; index++) {
        await blueprintRepository.save({
          name: `BR${index + 1}`,
          color: faker.color.rgb({ format: "hex", casing: "upper" }),
          description: `Blueprint ${index + 1}`,
          workspace,
        });
      }
    }
  }
}
