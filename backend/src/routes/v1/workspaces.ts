import { Router } from "express";
import { NumberId } from "types/NumberId";
import { GetEventsControllerTypes } from "types/controllers/Workspace/GetEventsController";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useAddSuperSchema } from "@schemas/Workspace/useAddSuperSchema";
import { useGetBySlugSchema } from "@schemas/Workspace/useGetBySlugSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Workspace/useUpdateSuperSchema";
import { useGetTreeSuperSchema } from "@schemas/Workspace/useGetTreeSuperSchema";
import { getTogglePinSuperSchema } from "@schemas/common/getTogglePinSuperSchema";
import { useGetEventsSuperSchema } from "@schemas/Workspace/useGetEventsSuperSchema";

import { PinController } from "@controllers/PinController";
import { BaseController } from "@controllers/BaseController";
import { UnpinController } from "@controllers/UnpinController";
import { AddController } from "@controllers/Workspace/AddController";
import { UpdateController } from "@controllers/Workspace/UpdateController";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { GetTreeController } from "@controllers/Workspace/GetTreeController";
import { GetEventsController } from "@controllers/Workspace/GetEventsController";
import { GetBySlugController } from "@controllers/Workspace/GetBySlugController";

const workspacesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

workspacesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

workspacesRouter.get(
  "/:slug",
  validateRequestWith({ [v1]: useGetBySlugSchema }),
  processRequestWith(GetBySlugController)
);

workspacesRouter.get(
  "/:id/tree",
  requireWorkspaceAccess<NumberId>(({ params }) => params.id),
  validateRequestWith({ [v1]: useGetTreeSuperSchema }),
  processRequestWith(GetTreeController)
);

workspacesRouter.get(
  "/:id/events",
  requirePermissions([Permission.ViewWorkspaceInsights]),
  requireWorkspaceAccess<NumberId & GetEventsControllerTypes.v1.QueryInput>(
    ({ params }) => params.id
  ),
  validateRequestWith({ [v1]: useGetEventsSuperSchema }),
  processRequestWith(GetEventsController)
);

workspacesRouter.post(
  "",
  requirePermissions([Permission.CreateWorkspace]),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

workspacesRouter.post(
  "/:id/pin",
  requirePermissions([Permission.UpdateWorkspace]),
  validateRequestWith({
    [v1]: getTogglePinSuperSchema(Di.WorkspaceRepository),
  }),
  processRequestWith(PinController)
);

workspacesRouter.post(
  "/:id/unpin",
  requirePermissions([Permission.UpdateWorkspace]),
  validateRequestWith({
    [v1]: getTogglePinSuperSchema(Di.WorkspaceRepository),
  }),
  processRequestWith(UnpinController)
);

workspacesRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateWorkspace]),
  validateRequestWith({ [v1]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = workspacesRouter;
