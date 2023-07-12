import { DataSource } from "typeorm";
import sampleSize from "lodash/sampleSize";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { TEST_WORKSPACE_2, TEST_WORKSPACE_1 } from "./common";

import { Tag } from "@entities/Tag";
import { Workspace } from "@entities/Workspace";

export class WorkspaceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceFactory = factoryManager.get(Workspace);

    const tagRepository = dataSource.getRepository(Tag);

    const tags = await tagRepository.find();

    await workspaceFactory.save({
      name: TEST_WORKSPACE_1.name,
      tags: sampleSize(tags, 3),
    });

    await workspaceFactory.save({
      name: TEST_WORKSPACE_2.name,
      tags: sampleSize(tags, 3),
    });
  }
}
