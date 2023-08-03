import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useStoreSuperSchema } from "@schemas/Blueprint/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Blueprint/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { StoreController } from "@controllers/Blueprint/StoreController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";

const blueprintsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

blueprintsRouter.use(requireWorkspaceAccess);

blueprintsRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

blueprintsRouter.post(
  "",
  requirePermissions([Permission.CreateBlueprint]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

blueprintsRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteBlueprint]),
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

blueprintsRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateBlueprint]),
  validateRequestWith({ [v1_0]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = blueprintsRouter;
