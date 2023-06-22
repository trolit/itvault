import { Router } from "express";

import { Permission } from "types/enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";

const rolesRouter = Router();

rolesRouter.use(requireAuthentication);

rolesRouter.use(requirePermissions([Permission.ViewAllRoles]));

rolesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

rolesRouter.put(
  "/v1/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith(useUpdateSuperSchema),
  processRequestWith(UpdateController)
);

export = rolesRouter;
