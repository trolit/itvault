import { Router } from "express";

import { APP } from "@config";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { isLimitNotReached } from "@middleware/isLimitNotReached";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useAddSuperSchema } from "@schemas/Role/useAddSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Role/AddController";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { GetPermissionsController } from "@controllers/Role/GetPermissionsController";

const rolesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

rolesRouter.use(requireAuthentication);

rolesRouter.get(
  "",
  requirePermissions([Permission.CreateRole, Permission.UpdateRole], {
    condition: "OR",
  }),
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
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
  isLimitNotReached(Di.RoleRepository, APP.TOTAL_ROLES_LIMIT),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

rolesRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith({ [v1]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = rolesRouter;
