import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Blueprint/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Blueprint/useUpdateSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Blueprint/StoreController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

blueprintsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);

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
