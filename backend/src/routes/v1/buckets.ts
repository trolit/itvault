import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useStoreSuperSchema } from "@schemas/Bucket/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Bucket/StoreController";
import { GetAllController } from "@controllers/Bucket/GetAllController";

const bucketsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

bucketsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
bucketsRouter.use(IsWorkspaceAvailable);

bucketsRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "",
  requirePermissions([Permission.ManageVariantColoring]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

export = bucketsRouter;
