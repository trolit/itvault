import { Router } from "express";

import { Permission } from "@enums/Permission";
import { getAllSchema } from "@schemas/Role/getAllSchema";
import { updateSchema } from "@schemas/Role/updateSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

const roleRoutes = Router();

roleRoutes.use(requireAuthentication);

roleRoutes.use(requirePermissions([Permission.ViewAllRoles]));

roleRoutes.get(
  "/v1",
  validateRequestWith(getAllSchema),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith(updateSchema),
  processRequestWith(UpdateController)
);

export = roleRoutes;
