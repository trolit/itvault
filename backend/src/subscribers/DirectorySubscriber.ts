import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

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

    for (let index = 1; index < splitRelativePathLength; index++) {
      const previusPath = splitRelativePath.slice(0, index).join("/");
      const currentPath = splitRelativePath.slice(0, index + 1).join("/");

      const directory = await manager.findOneBy(Directory, {
        relativePath: currentPath,
      });

      if (!directory) {
        const parentDirectory = await manager.findOneByOrFail(Directory, {
          relativePath: previusPath,
        });

        await manager.save({ relativePath: currentPath, parentDirectory });
      }
    }
  }
}
