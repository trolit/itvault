/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { Bundle } from "@db/entities/Bundle";
import { Bucket } from "@db/entities/Bucket";
import { Variant } from "@db/entities/Variant";
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
    handleWorkspaceEvent(event, Action.Create);
  }

  async afterUpdate(event: InsertEvent<any>) {
    handleWorkspaceEvent(event, Action.Update);
  }
}

async function handleWorkspaceEvent(event: InsertEvent<any>, action: Action) {
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
      action,
      manager,
    });

    return;
  }
}

async function onNoteEvent(arg: {
  entity: Note;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  if (action === Action.Delete) {
    // @TODO DELETE event

    return;
  }

  const note = await manager.findOneOrFail(Note, {
    where: {
      id: entity.id,
    },
    relations: {
      file: {
        workspace: true,
      },
    },
  });

  const record = manager.create(WorkspaceEvent, {
    entity: Note.name,
    action,
    workspace: note.file.workspace,
    user: {
      id: action === Action.Create ? entity.createdBy.id : entity.updatedBy.id,
    },
    targetId: entity.id.toString(),
  });

  await manager.save(record);
}
