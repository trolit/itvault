import path from "path";
import fs from "fs-extra";
import random from "lodash/random";
import { DataSource } from "typeorm";
import { User } from "@db/entities/User";
import { File } from "@db/entities/File";
import { Seeder } from "typeorm-extension";
import sampleSize from "lodash/sampleSize";
import { Bucket } from "@db/entities/Bucket";
import { Variant } from "@db/entities/Variant";
import { Blueprint } from "@db/entities/Blueprint";
import { Workspace } from "@db/entities/Workspace";
import { getRandomRecords } from "@db/seeds/helpers/getRandomRecords";

import { FILES } from "@config";

import { BucketContent } from "@shared/types/BucketContent";

export default class BucketSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const fileRepository = dataSource.getRepository(File);
    const bucketRepository = dataSource.getRepository(Bucket);
    const variantRepository = dataSource.getRepository(Variant);
    const blueprintRepository = dataSource.getRepository(Blueprint);
    const workspaceRepository = dataSource.getRepository(Workspace);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      const amountOfBlueprints = random(3, 5);

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

          const sampleBlueprints = sampleSize(blueprints, 2);

          const splitContent = content.split("\n");

          for (const blueprint of sampleBlueprints) {
            const [user] = await getRandomRecords(userRepository, 1);

            await bucketRepository.save(
              {
                value: this._generateValue(splitContent),
                variant,
                blueprint,
                createdBy: user,
                updatedBy: user,
              },
              {
                data: {
                  userId: user.id,
                  workspaceId: workspace.id,
                },
              }
            );
          }
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
