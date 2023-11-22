import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

import { FILES } from "@config/index";

import { Directory } from "@entities/Directory";

@EventSubscriber()
export class DirectorySubscriber
  implements EntitySubscriberInterface<Directory>
{
  listenTo() {
    return Directory;
  }

  // @TODO add ROOT dir through (subscriber's) event!
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

    console.info(`Insert request received upon ${relativePath}`);

    let previousDirectory: Directory = await manager.findOneByOrFail(
      Directory,
      {
        relativePath: ".",
      }
    );

    console.info(`Making sure that partial paths are in DB.`);

    for (let index = 1; index < splitRelativePathLength - 1; index++) {
      const currentPath = splitRelativePath.slice(0, index + 1).join("/");

      let currentDirectory = await manager.findOneBy(Directory, {
        relativePath: currentPath,
      });

      if (!currentDirectory && previousDirectory) {
        const dirToAdd = manager.create(Directory, {
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
      console.info(
        `Assigning parent directory (${previousDirectory.relativePath}) to ${relativePath}`
      );

      event.entity.parentDirectory = previousDirectory;
    }
  }
}
