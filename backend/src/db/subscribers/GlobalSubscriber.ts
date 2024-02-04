/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { Bundle } from "@db/entities/Bundle";
import { Bucket } from "@db/entities/Bucket";
import { Variant } from "@db/entities/Variant";
import { Workspace } from "@db/entities/Workspace";
import { Blueprint } from "@db/entities/Blueprint";
import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
  EntityManager,
} from "typeorm";

import { Action } from "@shared/types/enums/Action";

const ENTITIES_TO_LISTEN_TO = [
  Note.name,
  Bucket.name,
  Bundle.name,
  Variant.name,
  Blueprint.name,
];

@EventSubscriber()
export class WorkspacePartsSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    const {
      entity,
      manager,
      metadata: { name: entityName },
    } = event;

    if (!ENTITIES_TO_LISTEN_TO.includes(entityName)) {
      return;
    }

    if (entityName === Note.name) {
      await onNoteEvent({
        entity: <Note>entity,
        action: Action.Create,
        manager,
      });

      return;
    }
  }
}

async function onNoteEvent(arg: {
  entity: Note;
  action: Action;
  manager: EntityManager;
}) {
  // @TODO DELETE event

  const { action, manager, entity } = arg;

  const workspace = await manager.findOneOrFail(Workspace, {
    where: {
      files: {
        id: entity.file.id,
      },
    },
  });

  const record = manager.create(WorkspaceEvent, {
    entity: Note.name,
    action,
    workspace,
    user: {
      id: action === Action.Create ? entity.createdBy.id : entity.updatedBy.id,
    },
    targetId: entity.id.toString(),
  });

  await manager.save(record);
}
