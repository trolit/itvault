/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { Blueprint } from "@db/entities/Blueprint";
import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
  EntityManager,
} from "typeorm";

import { Action } from "@shared/types/enums/Action";

// @TODO add Bundle, Variant, Bucket
const WORKSPACE_EVENTS_CONFIG = [
  {
    entityName: Note.name,
    handler: onNoteEvent,
  },
  {
    entityName: Blueprint.name,
    handler: onBlueprintEvent,
  },
];

@EventSubscriber()
export class GlobalSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    await handleWorkspaceEvent(event, Action.Create);
  }

  async afterUpdate(event: InsertEvent<any>) {
    await handleWorkspaceEvent(event, Action.Update);
  }
}

async function handleWorkspaceEvent(event: InsertEvent<any>, action: Action) {
  const {
    entity,
    manager,
    metadata: { name: entityName },
  } = event;

  const onWorkspaceEvent = WORKSPACE_EVENTS_CONFIG.find(
    config => config.entityName === entityName
  );

  if (onWorkspaceEvent) {
    await onWorkspaceEvent.handler({ entity, action, manager });
  }
}

async function onBlueprintEvent(arg: {
  entity: Blueprint;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  if (action === Action.Delete) {
    // @TODO DELETE event

    return;
  }

  const record = manager.create(WorkspaceEvent, {
    entity: Blueprint.name,
    action,
    workspace: {
      id: entity.workspace.id,
    },
    user: {
      id: action === Action.Create ? entity.createdBy.id : entity.updatedBy.id,
    },
    targetId: entity.id.toString(),
  });

  await manager.save(record);
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

  const note = await manager.findOne(Note, {
    where: {
      id: entity.id,
    },
    relations: {
      file: {
        workspace: true,
      },
    },
  });

  if (!note) {
    return;
  }

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
