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
  EntityManager,
  EventSubscriber,
  SoftRemoveEvent,
  EntitySubscriberInterface,
  ObjectLiteral,
} from "typeorm";

import { Dependency } from "@enums/Dependency";
import { Action } from "@shared/types/enums/Action";

// @NOTE could expand it even more to include set of "smaller" actions like e.g. "Patch <property>"
const WORKSPACE_EVENT_HANDLERS = [
  {
    entityName: Note.name,
    getRecord: onNoteEvent,
    actions: [Action.Create, Action.Update, Action.SoftDelete],
  },
  {
    entityName: Blueprint.name,
    getRecord: onBlueprintEvent,
    actions: [Action.Create, Action.Update, Action.SoftDelete],
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

  async beforeSoftRemove(event: SoftRemoveEvent<any>) {
    await handleWorkspaceEvent(event, Action.SoftDelete);
  }
}

async function handleWorkspaceEvent(
  event: InsertEvent<any> | SoftRemoveEvent<any>,
  action: Action
) {
  const {
    entity,
    manager,
    queryRunner: { data },
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

  const record = await eventHandler.getRecord({
    data,
    entity,
    action,
    manager,
  });

  if (!record) {
    log.debug({
      message: `${action} trace of ${entityName} not received!`,
      dependency: Dependency.TypeORM,
    });

    return;
  }

  await manager.save(record);
}

async function onVariantEvent(arg: {
  data: ObjectLiteral;
  entity: Variant;
  action: Action;
  manager: EntityManager;
}) {
  const { data, action, manager, entity } = arg;
  const { userId } = data;

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
      id: userId,
    },
    targetId: entity.id.toString(),
  });

  return record;
}

async function onBundleEvent(arg: {
  data: ObjectLiteral;
  entity: Bundle;
  action: Action;
  manager: EntityManager;
}) {
  const { data, action, manager, entity } = arg;
  const { userId } = data;

  const record = manager.create(WorkspaceTrace, {
    entity: Bundle.name,
    action,
    workspace: {
      id: entity.workspace.id,
    },
    user: {
      id: userId,
    },
    targetId: entity.id.toString(),
  });

  return record;
}

async function onBucketEvent(arg: {
  data: ObjectLiteral;
  entity: Bucket;
  action: Action;
  manager: EntityManager;
}) {
  const { data, action, manager, entity } = arg;

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

  const { userId } = data;

  const record = manager.create(WorkspaceTrace, {
    entity: Bucket.name,
    action,
    workspace: {
      id: workspace.id,
    },
    user: {
      id: userId,
    },
    targetId: entity.id.toString(),
  });

  return record;
}

async function onBlueprintEvent(arg: {
  data: ObjectLiteral;
  entity: Blueprint;
  action: Action;
  manager: EntityManager;
}) {
  const { data, action, manager, entity } = arg;
  const { userId } = data;

  const record = manager.create(WorkspaceTrace, {
    entity: Blueprint.name,
    action,
    workspace: {
      id: entity.workspace.id,
    },
    user: {
      id: userId,
    },
    targetId: entity.id.toString(),
  });

  return record;
}

async function onNoteEvent(arg: {
  data: ObjectLiteral;
  entity: Note;
  action: Action;
  manager: EntityManager;
}) {
  const { data, action, manager, entity } = arg;

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

  const { userId } = data;

  const record = manager.create(WorkspaceTrace, {
    entity: Note.name,
    action,
    workspace: note.file.workspace,
    user: {
      id: userId,
    },
    targetId: entity.id.toString(),
  });

  return record;
}
