import path from "path";
import fs from "fs-extra";
import crypto from "crypto";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { createFile } from "./common/createFile";
import { TEST_WORKSPACE_1, HEAD_ADMIN_ROLE_TEST_ACCOUNT } from "./common";

import { User } from "@entities/User";
import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";

export default class VariantSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const userRepository = dataSource.getRepository(User);

    const workspace = await workspaceRepository.findOneBy({
      name: TEST_WORKSPACE_1.name,
    });

    const user = await userRepository.findOneBy({
      email: HEAD_ADMIN_ROLE_TEST_ACCOUNT.email,
    });

    if (!workspace || !user) {
      return;
    }

    const uploadDir = path.join(
      FILES.BASE_UPLOADS_PATH,
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
        createdBy: user,
      });

      await variantRepository.save(variant);
    }
  }
}
