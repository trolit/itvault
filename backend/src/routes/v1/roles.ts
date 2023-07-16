import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Role/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";

import { StoreController } from "@controllers/Role/StoreController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { GetAllController } from "@controllers/Role/GetAllController";

const rolesRouter = Router();

rolesRouter.use(requireAuthentication);

rolesRouter.use(requirePermissions([Permission.ViewAllRoles]));

rolesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

rolesRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

rolesRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith(useUpdateSuperSchema, {
    versions: UpdateController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateController)
);

export = rolesRouter;
