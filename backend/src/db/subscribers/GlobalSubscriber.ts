/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { Bundle } from "@db/entities/Bundle";
import { Bucket } from "@db/entities/Bucket";
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

// @TODO add Variant
const WORKSPACE_EVENT_HANDLERS = [
  {
    entityName: Note.name,
    run: onNoteEvent,
  },
  {
    entityName: Blueprint.name,
    run: onBlueprintEvent,
  },
  {
    entityName: Bucket.name,
    run: onBucketEvent,
  },
  {
    entityName: Bundle.name,
    run: onBundleEvent,
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

  const workspaceEvent = WORKSPACE_EVENT_HANDLERS.find(
    config => config.entityName === entityName
  );

  if (workspaceEvent) {
    await workspaceEvent.run({ entity, action, manager });
  }
}

async function onBundleEvent(arg: {
  entity: Bundle;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  if (action === Action.Create) {
    return;
  }

  const record = manager.create(WorkspaceEvent, {
    entity: Bundle.name,
    action,
    workspace: {
      id: entity.workspace.id,
    },
    user: {
      id: entity.createdBy.id,
    },
    targetId: entity.id.toString(),
  });

  await manager.save(record);
}

async function onBucketEvent(arg: {
  entity: Bucket;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  if (action === Action.Delete) {
    return;
  }

  const workspace = await manager.findOne(Workspace, {
    where: {
      blueprints: {
        id: entity.blueprint.id,
      },
    },
  });

  if (!workspace) {
    return;
  }

  const record = manager.create(WorkspaceEvent, {
    entity: Bucket.name,
    action,
    workspace: {
      id: workspace.id,
    },
    user: {
      id: action === Action.Create ? entity.createdBy.id : entity.updatedBy.id,
    },
    targetId: entity.id.toString(),
  });

  await manager.save(record);
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
