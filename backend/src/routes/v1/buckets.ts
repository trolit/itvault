import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";
import { useStoreManySuperSchema } from "@schemas/Bucket/useStoreManySuperSchema";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/Bucket/GetAllController";
import { StoreManyController } from "@controllers/Bucket/StoreManyController";

const bucketsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

bucketsRouter.use(requireWorkspaceAccess);
bucketsRouter.use(IsWorkspaceAvailable);

bucketsRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "",
  requirePermissions([Permission.ManageVariantColoring]),
  validateRequestWith({ [v1_0]: useStoreManySuperSchema }),
  processRequestWith(StoreManyController)
);

export = bucketsRouter;
