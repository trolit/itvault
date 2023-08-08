import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Role/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Role/StoreController";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";

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
