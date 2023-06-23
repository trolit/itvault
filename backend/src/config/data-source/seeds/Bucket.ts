import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { TEST_WORKSPACE_1 } from "./common";

import { File } from "@entities/File";
import { Bucket } from "@entities/Bucket";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";
import { Blueprint } from "@entities/Blueprint";

export class BucketSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspace = await workspaceRepository.findOneBy({
      name: TEST_WORKSPACE_1.name,
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

    const bucketRepository = dataSource.getRepository(Bucket);

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
            FILES.BASE_UPLOADS_PATH,
            `workspace-${workspace.id}`,
            variant.filename
          )
        );

        const content = file.toString();

        const blueprint = sample(blueprints) || blueprints[0];

        const splitContent = content.split("\n");

        await bucketRepository.save({
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

    const availableRows = splitContent.length - 1;

    for (let index = 0; index < iterations; index++) {
      const row = random(availableRows);

      const line = splitContent[row];

      const endIndex = random(0, line.length - 1);

      const part = `0-${endIndex}`;

      if (value[row]) {
        value[row].push(part);

        continue;
      }

      value[row] = [part];
    }

    return value;
  }
}
