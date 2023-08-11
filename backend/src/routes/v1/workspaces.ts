import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useGetBySlugSchema } from "@schemas/Workspace/useGetBySlugSchema";
import { useStoreSuperSchema } from "@schemas/Workspace/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Workspace/useUpdateSuperSchema";
import { useGetTreeSuperSchema } from "@schemas/Workspace/useGetTreeSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Workspace/StoreController";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { UpdateController } from "@controllers/Workspace/UpdateController";
import { GetTreeController } from "@controllers/Workspace/GetTreeController";
import { GetBySlugController } from "@controllers/Workspace/GetBySlugController";

const workspacesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

workspacesRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

workspacesRouter.get(
  "/:slug",
  validateRequestWith({ [v1_0]: useGetBySlugSchema }),
  processRequestWith(GetBySlugController)
);

workspacesRouter.get(
  "/:id/tree",
  validateRequestWith({ [v1_0]: useGetTreeSuperSchema }),
  processRequestWith(GetTreeController)
);

workspacesRouter.post(
  "",
  requirePermissions([Permission.CreateWorkspace]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

workspacesRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateWorkspace]),
  validateRequestWith({ [v1_0]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = workspacesRouter;
