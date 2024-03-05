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

import { createFile } from "./helpers/createFile";

import { FileStorageMode } from "@enums/FileStorageMode";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export default class VariantSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const fileRepository = dataSource.getRepository(File);
    const variantRepository = dataSource.getRepository(Variant);
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspaces = await workspaceRepository.find();

    const headAdmin = await userRepository.findOneBy({
      id: HEAD_ADMIN_ROLE.id,
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
          let size = 0;
          const UUID = crypto.randomUUID();
          const variantFilename = UUID.concat(".", extension);

          if (FILES.ACTIVE_MODE === FileStorageMode.Local) {
            size = await createFile(variantFilename, extension, uploadDir);
          }

          await variantRepository.save(
            {
              name: `v${index + 1}`,
              filename: variantFilename,
              file,
              size,
              createdBy: headAdmin,
            },
            {
              data: {
                userId: headAdmin.id,
              },
            }
          );
        }
      }
    }
  }
}
