/* eslint-disable @typescript-eslint/no-explicit-any */

import { Note } from "@db/entities/Note";
import { Bundle } from "@db/entities/Bundle";
import { Bucket } from "@db/entities/Bucket";
import { Variant } from "@db/entities/Variant";
import { Blueprint } from "@db/entities/Blueprint";
import { Workspace } from "@db/entities/Workspace";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import {
  InsertEvent,
  EventSubscriber,
  EntitySubscriberInterface,
  EntityManager,
} from "typeorm";

import { Action } from "@shared/types/enums/Action";

// @NOTE could expand it even more to include set of "smaller" actions like e.g. "Patch <property>"
const WORKSPACE_EVENT_HANDLERS = [
  {
    entityName: Note.name,
    getRecord: onNoteEvent,
    // @TODO cover DELETE action
    actions: [Action.Create, Action.Update],
  },
  {
    entityName: Blueprint.name,
    getRecord: onBlueprintEvent,
    // @TODO cover DELETE action
    actions: [Action.Create, Action.Update],
  },
  {
    entityName: Bucket.name,
    getRecord: onBucketEvent,
    actions: [Action.Create, Action.Update],
  },
  {
    entityName: Bundle.name,
    getRecord: onBundleEvent,
    actions: [Action.Create],
  },
  {
    entityName: Variant.name,
    getRecord: onVariantEvent,
    actions: [Action.Create],
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

  const eventHandler = WORKSPACE_EVENT_HANDLERS.find(
    eventHandler =>
      eventHandler.entityName === entityName &&
      eventHandler.actions.includes(action)
  );

  if (!eventHandler) {
    return;
  }

  const record = await eventHandler.getRecord({ entity, action, manager });

  if (record) {
    await manager.save(record);
  }
}

async function onVariantEvent(arg: {
  entity: Variant;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  const workspace = await manager.findOne(Workspace, {
    where: {
      files: {
        id: entity.file.id,
      },
    },
  });

  if (!workspace) {
    return;
  }

  const record = manager.create(WorkspaceTrace, {
    entity: Variant.name,
    action,
    workspace,
    user: {
      id: entity.createdBy.id,
    },
    targetId: entity.id.toString(),
  });

  return record;
}

async function onBundleEvent(arg: {
  entity: Bundle;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  const record = manager.create(WorkspaceTrace, {
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

  return record;
}

async function onBucketEvent(arg: {
  entity: Bucket;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

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

  const record = manager.create(WorkspaceTrace, {
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

  return record;
}

async function onBlueprintEvent(arg: {
  entity: Blueprint;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

  const record = manager.create(WorkspaceTrace, {
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

  return record;
}

async function onNoteEvent(arg: {
  entity: Note;
  action: Action;
  manager: EntityManager;
}) {
  const { action, manager, entity } = arg;

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

  const record = manager.create(WorkspaceTrace, {
    entity: Note.name,
    action,
    workspace: note.file.workspace,
    user: {
      id: action === Action.Create ? entity.createdBy.id : entity.updatedBy.id,
    },
    targetId: entity.id.toString(),
  });

  return record;
}
