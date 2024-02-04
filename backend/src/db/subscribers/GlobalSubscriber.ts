/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
} from "typeorm";

import { Action } from "@shared/types/enums/Action";

@EventSubscriber()
export class WorkspacePartsSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    const {
      entity,
      manager,
      metadata: { name: entityName },
    } = event;

    // @TODO
    // if (entityName === "Note") {
    //   const castedEntity = <Note>entity;

    //   const record = manager.create(WorkspaceEvent, {
    //     entity: entityName,
    //     action: Action.Create,
    //     user: castedEntity.createdBy,
    //     workspace: castedEntity.file.workspace,
    //     targetId: castedEntity.id.toString(),
    //   });

    //   await manager.save(record);

    //   return;
    // }
  }
}
