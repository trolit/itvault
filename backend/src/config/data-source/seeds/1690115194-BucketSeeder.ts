import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { FILES } from "@config";

import { getRandomRecords } from "./common";

import { File } from "@entities/File";
import { Bucket } from "@entities/Bucket";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";
import { Blueprint } from "@entities/Blueprint";
import { BucketContent } from "@shared/types/BucketContent";

export default class BucketSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const fileRepository = dataSource.getRepository(File);
    const bucketRepository = dataSource.getRepository(Bucket);
    const variantRepository = dataSource.getRepository(Variant);
    const blueprintRepository = dataSource.getRepository(Blueprint);
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      const amountOfBlueprints = random(8, 13);

      const blueprints = await getRandomRecords(
        blueprintRepository,
        amountOfBlueprints,
        ["workspace"],
        qb =>
          qb.where("workspace.id = :workspaceId", {
            workspaceId: workspace.id,
          })
      );

      const files = await fileRepository.findBy({
        workspace: {
          id: workspace.id,
        },
      });

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
            value: this._generateValue(splitContent),
            variant,
            blueprint,
          });
        }
      }
    }
  }

  private _generateValue(splitContent: string[]) {
    const iterations = random(1, 6);

    const value: BucketContent = {};

    const availableRows = splitContent.length - 1;

    for (let index = 0; index < iterations; index++) {
      const row = random(availableRows);

      const line = splitContent[row];

      if (line === "\n") {
        continue;
      }

      const endIndex = random(1, line.length - 1);

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
