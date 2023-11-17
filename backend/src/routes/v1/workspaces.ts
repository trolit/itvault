import { Router } from "express";
import { NumberId } from "types/NumberId";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useGetBySlugSchema } from "@schemas/Workspace/useGetBySlugSchema";
import { useUpdateSuperSchema } from "@schemas/Workspace/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";
import { useGetTreeSuperSchema } from "@schemas/Workspace/useGetTreeSuperSchema";
import { getTogglePinSuperSchema } from "@schemas/common/getTogglePinSuperSchema";

import { PinController } from "@controllers/PinController";
import { BaseController } from "@controllers/BaseController";
import { UnpinController } from "@controllers/UnpinController";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { UpdateController } from "@controllers/Workspace/UpdateController";
import { GetTreeController } from "@controllers/Workspace/GetTreeController";
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
