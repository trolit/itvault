import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";
import { useStoreManySuperSchema } from "@schemas/Bucket/useStoreManySuperSchema";

import { GetAllController } from "@controllers/Bucket/GetAllController";
import { StoreManyController } from "@controllers/Bucket/StoreManyController";

const bucketsRouter = Router();

bucketsRouter.use(requireWorkspaceAccess);
bucketsRouter.use(IsWorkspaceAvailable);

bucketsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "",
  requirePermissions([Permission.ManageVariantColoring]),
  validateRequestWith(useStoreManySuperSchema, {
    versions: StoreManyController.ALL_VERSIONS,
  }),
  processRequestWith(StoreManyController)
);

export = bucketsRouter;
