import { Seeder } from "typeorm-extension";
import { DataSource, Repository } from "typeorm";

import {
  TEST_COMMON_BLUEPRINT,
  TEST_LOCKED_WORKSPACE,
  TEST_UNLOCKED_WORKSPACE,
} from "./common";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { BlueprintToWorkspace } from "@entities/BlueprintToWorkspace";

export class BlueprintToWorkspaceSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const blueprintRepository = dataSource.getRepository(Blueprint);

    const workspaceRepository = dataSource.getRepository(Workspace);

    const blueprintToWorkspaceRepository =
      dataSource.getRepository(BlueprintToWorkspace);

    const blueprint = await blueprintRepository.findOneBy({
      name: TEST_COMMON_BLUEPRINT.name,
    });

    if (!blueprint) {
      return;
    }

    await updateBlueprintToWorkspaceBridge(
      workspaceRepository,
      blueprintToWorkspaceRepository,
      blueprint,
      TEST_UNLOCKED_WORKSPACE.name
    );

    await updateBlueprintToWorkspaceBridge(
      workspaceRepository,
      blueprintToWorkspaceRepository,
      blueprint,
      TEST_LOCKED_WORKSPACE.name
    );
  }
}

async function updateBlueprintToWorkspaceBridge(
  workspaceRepository: Repository<Workspace>,
  blueprintToWorkspaceRepository: Repository<BlueprintToWorkspace>,
  blueprint: Blueprint,
  name: string
) {
  const workspace = await workspaceRepository.findOneBy({
    name,
  });

  if (workspace) {
    await blueprintToWorkspaceRepository.save({
      blueprint,
      workspace,
    });
  }
}
