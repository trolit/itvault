import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";
import { useUpsertSuperSchema } from "@schemas/Bucket/useUpsertSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/Bucket/GetAllController";
import { UpsertController } from "@controllers/Bucket/UpsertController";

const bucketsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

bucketsRouter.use(requireAuthentication);
bucketsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
bucketsRouter.use(IsWorkspaceAvailable);

bucketsRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "",
  requirePermissions([Permission.ManageVariantColoring]),
  validateRequestWith({ [v1]: useUpsertSuperSchema }),
  processRequestWith(UpsertController)
);

export = bucketsRouter;
