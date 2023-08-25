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
    const value: BucketContent = {};
    const availableRows = splitContent.length - 1;
    const iterations = random(1, splitContent.length);

    const getMinNumber = (lineColoring: string[]) => {
      let biggestMaxValue = 0;

      for (const coloring of lineColoring) {
        const [, to] = coloring.split("-");

        const parsedTo = parseInt(to);

        if (parsedTo > biggestMaxValue) {
          biggestMaxValue = parsedTo;
        }
      }

      return biggestMaxValue + random(2, 4);
    };

    for (let index = 0; index < iterations; index++) {
      const rowIndex = random(availableRows);

      const row = splitContent[rowIndex];

      if (!row || row === "\n") {
        continue;
      }

      const rowLength = row.length;
      const lineColoring = value[rowIndex];
      const minNumber = lineColoring
        ? getMinNumber(lineColoring)
        : random(0, 5);

      if (minNumber >= rowLength - 4) {
        continue;
      }

      const endIndex = random(minNumber, rowLength - 1);
      const difference = endIndex - minNumber;

      if (difference <= 1 || (lineColoring && minNumber >= endIndex - 3)) {
        continue;
      }

      const part = `${minNumber}-${endIndex}`;

      if (lineColoring) {
        lineColoring.push(part);

        continue;
      }

      value[rowIndex] = [part];
    }

    return value;
  }
}
