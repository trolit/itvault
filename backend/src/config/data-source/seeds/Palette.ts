import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import sample from "lodash/sample";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";
import { DataSource } from "typeorm";
import { File } from "@entities/File";
import { Palette } from "@entities/Palette";
import { Variant } from "@entities/Variant";
import { Blueprint } from "@entities/Blueprint";
import { Workspace } from "@entities/Workspace";
import { TEST_UNLOCKED_WORKSPACE } from "./common";

export class PaletteSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOneBy({
      name: TEST_UNLOCKED_WORKSPACE.name,
    });

    if (!workspace) {
      return;
    }

    const fileRepository = dataSource.getRepository(File);

    const files = await fileRepository.findBy({
      workspace: {
        id: workspace.id,
      },
    });

    if (!files.length) {
      return;
    }

    const variantRepository = dataSource.getRepository(Variant);

    const paletteRepository = dataSource.getRepository(Palette);

    const blueprintRepository = dataSource.getRepository(Blueprint);

    const blueprints = await blueprintRepository.findBy({
      workspace: {
        id: workspace.id,
      },
    });

    if (!blueprints.length) {
      return;
    }

    for (const file of files) {
      const variants = await variantRepository.findBy({
        file: {
          id: file.id,
        },
      });

      for (const variant of variants) {
        const file = await fs.readFile(
          path.join(
            FILES.STORAGE.LOCAL.BASE_PATH,
            `workspace-${workspace.id}`,
            variant.filename
          )
        );

        const content = file.toString();

        const blueprint = sample(blueprints) || blueprints[0];

        const splitContent = content.split("\n");

        await paletteRepository.save({
          value: this.generateValue(splitContent),
          variant,
          blueprint,
        });
      }
    }
  }

  private generateValue(splitContent: string[]) {
    const iterations = random(1, 3);

    const value: Record<number, string[]> = {};

    const splitContentLength = splitContent.length;

    for (let index = 0; index < iterations; index++) {
      const rowNumber = random(splitContentLength);

      const line = splitContent[rowNumber];

      const endIndex = random(0, line.length - 1);

      const part = `0-${endIndex}`;

      if (value[rowNumber]) {
        value[rowNumber].push(part);

        continue;
      }

      value[rowNumber] = [part];
    }

    return value;
  }
}
