import { Router } from "express";

import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { useGetAllSuperSchema } from "@schemas/Role/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Role/useUpdateSuperSchema";

const roleRoutes = Router();

roleRoutes.use(requireAuthentication);

roleRoutes.use(requirePermissions([Permission.ViewAllRoles]));

roleRoutes.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith(useUpdateSuperSchema),
  processRequestWith(UpdateController)
);

export = roleRoutes;
