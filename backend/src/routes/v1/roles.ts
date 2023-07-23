import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Role/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";

import { StoreController } from "@controllers/Role/StoreController";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";

const rolesRouter = Router();

rolesRouter.use(requireAuthentication);

rolesRouter.use(requirePermissions([Permission.ViewAllRoles]));

rolesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
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
