import { Router } from "express";
import { NumberId } from "types/NumberId";

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
import { useGetTracesSuperSchema } from "@schemas/Workspace/useGetTracesSuperSchema";
import { useGetTracesSeriesSuperSchema } from "@schemas/Workspace/useGetTracesSeriesSuperSchema";
import { useGetContributorsSuperSchema } from "@schemas/Workspace/useGetContributorsSuperSchema";

import { PinController } from "@controllers/PinController";
import { BaseController } from "@controllers/BaseController";
import { UnpinController } from "@controllers/UnpinController";
import { AddController } from "@controllers/Workspace/AddController";
import { UpdateController } from "@controllers/Workspace/UpdateController";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { GetTreeController } from "@controllers/Workspace/GetTreeController";
import { GetTracesController } from "@controllers/Workspace/GetTracesController";
import { GetBySlugController } from "@controllers/Workspace/GetBySlugController";
import { GetTracesSeriesController } from "@controllers/Workspace/GetTracesSeriesController";
import { GetContributorsController } from "@controllers/Workspace/GetContributorsController";

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

// @NOTE -- insights -- (consider nesting router but this also implies changes on setupExpress -> getRoutes)

workspacesRouter.get(
  "/:id/traces",
  requirePermissions([Permission.ViewWorkspaceInsights]),
  requireWorkspaceAccess<NumberId>(({ params }) => params.id),
  validateRequestWith({ [v1]: useGetTracesSuperSchema }),
  transformPagination(),
  processRequestWith(GetTracesController)
);

workspacesRouter.get(
  "/:id/traces-series",
  requirePermissions([Permission.ViewWorkspaceInsights]),
  requireWorkspaceAccess<NumberId>(({ params }) => params.id),
  validateRequestWith({
    [v1]: useGetTracesSeriesSuperSchema,
  }),
  processRequestWith(GetTracesSeriesController)
);

workspacesRouter.get(
  "/:id/contributors",
  requirePermissions([Permission.ViewWorkspaceInsights]),
  requireWorkspaceAccess<NumberId>(({ params }) => params.id),
  validateRequestWith({
    [v1]: useGetContributorsSuperSchema,
  }),
  processRequestWith(GetContributorsController)
);

export = workspacesRouter;
