import path from "path";
import fs from "fs-extra";
import crypto from "crypto";
import random from "lodash/random";
import { DataSource } from "typeorm";
import { User } from "@db/entities/User";
import { File } from "@db/entities/File";
import { Seeder } from "typeorm-extension";
import { Variant } from "@db/entities/Variant";
import { Workspace } from "@db/entities/Workspace";

import { FILES } from "@config";

import { createFile } from "./common/createFile";
import { HEAD_ADMIN_ROLE_TEST_ACCOUNT } from "./common";

export default class VariantSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const fileRepository = dataSource.getRepository(File);
    const variantRepository = dataSource.getRepository(Variant);
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspaces = await workspaceRepository.find();

    const headAdmin = await userRepository.findOneBy({
      email: HEAD_ADMIN_ROLE_TEST_ACCOUNT.email,
    });

    if (!headAdmin) {
      return;
    }

    for (const workspace of workspaces) {
      const uploadDir = path.join(
        FILES.BASE_UPLOADS_PATH,
        `workspace-${workspace.id}`
      );

      await fs.emptyDir(uploadDir);

      const files = await fileRepository.find({
        where: {
          workspace: {
            id: workspace.id,
          },
        },
      });

      for (const file of files) {
        const numberOfVariants = random(2, 3);

        const filename = file.originalFilename;
        const extension = filename.split(".").pop() || "";

        for (let index = 0; index < numberOfVariants; index++) {
          const UUID = crypto.randomUUID();
          const variantFilename = UUID.concat(".", extension);

          const size = await createFile(variantFilename, extension, uploadDir);

          await variantRepository.save({
            name: `v${index + 1}`,
            filename: variantFilename,
            file,
            size,
            createdBy: headAdmin,
          });
        }
      }
    }
  }
}
