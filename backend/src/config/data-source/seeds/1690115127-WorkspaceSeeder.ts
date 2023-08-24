import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { Tag } from "@entities/Tag";
import { Workspace } from "@entities/Workspace";
import { TagToWorkspace } from "@entities/TagToWorkspace";

export default class WorkspaceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const workspaceFactory = factoryManager.get(Workspace);
    const tagRepository = dataSource.getRepository(Tag);
    const tagToWorkspaceRepository = dataSource.getRepository(TagToWorkspace);

    for (let index = 0; index < 15; index++) {
      const tags = await tagRepository.find({ take: 3 });

      const tagToWorkspace = tags.map(tag => {
        return tagToWorkspaceRepository.create({ tag });
      });

      await workspaceFactory.save({
        tagToWorkspace,
      });
    }
  }
}
