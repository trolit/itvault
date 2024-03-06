import random from "lodash/random";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { User } from "@db/entities/User";
import { Seeder } from "typeorm-extension";
import { Workspace } from "@db/entities/Workspace";
import { Blueprint } from "@db/entities/Blueprint";

import { getRandomRecords } from "./helpers/getRandomRecords";

export default class BlueprintSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const workspaceRepository = dataSource.getRepository(Workspace);
    const blueprintRepository = dataSource.getRepository(Blueprint);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      const descriptionCount = random(8, 25);

      for (let index = 0; index < 20; index++) {
        const [user] = await getRandomRecords(userRepository, 1);

        await blueprintRepository.save(
          {
            name: `BR${index + 1}`,
            color: faker.color.rgb({ format: "hex", casing: "upper" }),
            description: faker.random.words(descriptionCount),
            workspace,
            createdBy: user,
            updatedBy: user,
          },
          {
            data: {
              userId: user.id,
              workspaceId: workspace.id,
            },
          }
        );
      }
    }
  }
}
