import path from "path";
import fs from "fs-extra";
import crypto from "crypto";
import random from "lodash/random";
import { DataSource } from "typeorm";
import { File } from "@db/entities/File";
import { User } from "@db/entities/User";
import { Seeder } from "typeorm-extension";
import { Variant } from "@db/entities/Variant";
import { Workspace } from "@db/entities/Workspace";
import { createFile } from "@db/seeds/helpers/createFile";

import { FILES } from "@config";

import { FileStorageMode } from "@enums/FileStorageMode";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

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
        relations: {
          workspace: true,
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
            getOptionsOfTraceRelatedEntity({
              userId: headAdmin.id,
              workspaceId: file.workspace.id,
            })
          );
        }
      }
    }
  }
}
