import { Directory } from "@db/entities/Directory";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

import { FILES } from "@config/index";

import { Service } from "@enums/Service";

@EventSubscriber()
export class DirectorySubscriber
  implements EntitySubscriberInterface<Directory>
{
  listenTo() {
    return Directory;
  }

  async beforeInsert(event: InsertEvent<Directory>) {
    const {
      manager,
      entity: { relativePath },
    } = event;

    const splitRelativePath = relativePath.split("/");
    const splitRelativePathLength = splitRelativePath.length;

    if (relativePath === FILES.ROOT) {
      return;
    }

    this._log(`Insert request received upon ${relativePath}`);

    let previousDirectory: Directory | null = await manager.findOneBy(
      Directory,
      {
        relativePath: FILES.ROOT,
      }
    );

    if (!previousDirectory) {
      previousDirectory = await manager.save(
        manager.create(Directory, { relativePath: FILES.ROOT }),
        { listeners: false }
      );
    }

    this._log(`Making sure that partial paths are in DB.`);

    for (let index = 1; index < splitRelativePathLength - 1; index++) {
      const currentPath = splitRelativePath.slice(0, index + 1).join("/");

      let currentDirectory = await manager.findOneBy(Directory, {
        relativePath: currentPath,
      });

      if (!currentDirectory && previousDirectory) {
        const dirToAdd: Directory = manager.create(Directory, {
          relativePath: currentPath,
          parentDirectory: {
            id: previousDirectory.id,
          },
        });

        currentDirectory = await event.manager.save(dirToAdd, {
          listeners: false,
        });
      }

      if (currentDirectory) {
        previousDirectory = currentDirectory;
      }
    }

    if (!event.entity.parentDirectory) {
      this._log(
        `Assigning parent directory (${previousDirectory.relativePath}) to ${relativePath}`
      );

      event.entity.parentDirectory = previousDirectory;
    }
  }

  private _log(message: string) {
    if (!log) {
      return;
    }

    log.debug({
      service: Service.TypeORM,
      message,
    });
  }
}
