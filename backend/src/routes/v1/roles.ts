import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Role/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Role/StoreController";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { GetPermissionsController } from "@controllers/Role/GetPermissionsController";

const rolesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

rolesRouter.use(requireAuthentication);

rolesRouter.get(
  "",
  requirePermissions(GetAllController.isMissingPermissions),
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

rolesRouter.get(
  "/:id/permissions",
  requirePermissions([Permission.UpdateRole]),
  requireEndpointVersion(GetPermissionsController.ALL_VERSIONS),
  processRequestWith(GetPermissionsController)
);

rolesRouter.post(
  "",
  requirePermissions([Permission.CreateRole]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

rolesRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith({ [v1_0]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = rolesRouter;
