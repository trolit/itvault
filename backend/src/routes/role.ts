import { Router } from "express";

import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { getAllSuperSchema } from "@schemas/Role/getAllSuperSchema";
import { requirePermissions } from "@middleware/requirePermissions";
import { updateSuperSchema } from "@schemas/Role/updateSuperSchema";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

const roleRoutes = Router();

roleRoutes.use(requireAuthentication);

roleRoutes.use(requirePermissions([Permission.ViewAllRoles]));

roleRoutes.get(
  "/v1",
  validateRequestWith(getAllSuperSchema),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requirePermissions([Permission.UpdateRole]),
  validateRequestWith(updateSuperSchema),
  processRequestWith(UpdateController)
);

export = roleRoutes;
