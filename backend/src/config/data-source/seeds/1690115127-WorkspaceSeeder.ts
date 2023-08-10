import { DataSource } from "typeorm";
import kebabCase from "lodash/kebabCase";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { TEST_WORKSPACE_2, TEST_WORKSPACE_1 } from "./common";

import { Tag } from "@entities/Tag";
import { Workspace } from "@entities/Workspace";

export default class WorkspaceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceFactory = factoryManager.get(Workspace);

    const workspaceRepository = dataSource.getRepository(Workspace);

    const tagRepository = dataSource.getRepository(Tag);

    const tags = await tagRepository.find({ take: 3 });

    const workspace1 = await workspaceFactory.save({
      name: TEST_WORKSPACE_1.name,
      slug: kebabCase(TEST_WORKSPACE_1.name),
    });

    await workspaceRepository.update(
      { id: workspace1.id },
      { tagToWorkspace: tags.map(tag => ({ tag, workspace: workspace1 })) }
    );

    const workspace2 = await workspaceFactory.save({
      name: TEST_WORKSPACE_2.name,
      slug: kebabCase(TEST_WORKSPACE_2.name),
    });

    await workspaceRepository.update(
      { id: workspace2.id },
      { tagToWorkspace: tags.map(tag => ({ tag, workspace: workspace2 })) }
    );
  }
}
