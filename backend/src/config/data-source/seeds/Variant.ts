import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { TEST_UNLOCKED_WORKSPACE } from "./common";

export class FileSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const fileRepository = dataSource.getRepository(File);

    const files = await fileRepository.find({
      where: {
        workspace: {
          name: TEST_UNLOCKED_WORKSPACE.name,
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

      const variant = variantRepository.create({
        name: "v1",
        filename: variantFilename,
        file,
      });

      await variantRepository.save(variant);
    }
  }
}
