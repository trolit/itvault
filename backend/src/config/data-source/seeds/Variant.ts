import crypto from "crypto";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";
import { createFile } from "./common/createFile";
import { TEST_UNLOCKED_WORKSPACE } from "./common";

export class VariantSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOneBy({
      name: TEST_UNLOCKED_WORKSPACE.name,
    });

    if (!workspace) {
      return;
    }

    const fileRepository = dataSource.getRepository(File);

    const files = await fileRepository.find({
      where: {
        workspace: {
          id: workspace.id,
        },
      },
    });

    if (!files.length) {
      return;
    }

    const variantRepository = dataSource.getRepository(Variant);

    for (const file of files) {
      const filename = file.originalFilename;
      const extension = filename.split(".").pop() || "";

      const UUID = crypto.randomUUID();

      const variantFilename = UUID.concat(".", extension);

      const size = await createFile(workspace.id, variantFilename, extension);

      const variant = variantRepository.create({
        name: "v1",
        filename: variantFilename,
        file,
        size,
      });

      await variantRepository.save(variant);
    }
  }
}
