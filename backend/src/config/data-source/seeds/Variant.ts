import path from "path";
import fs from "fs-extra";
import crypto from "crypto";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";
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

    const uploadDir = path.join(
      FILES.STORAGE.LOCAL.BASE_PATH,
      `workspace-${workspace.id}`
    );

    await fs.emptyDir(uploadDir);

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

      const size = await createFile(variantFilename, extension, uploadDir);

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
