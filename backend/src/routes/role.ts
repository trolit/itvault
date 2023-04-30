import { Router } from "express";

import { Permission } from "@enums/Permission";
import { getAllSchema } from "@schemas/role/getAll";
import { updateSchema } from "@schemas/role/update";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { requireAuthentication } from "@middleware/requireAuthentication";

const roleRoutes = Router();

roleRoutes.get(
  "/v1",
  requireAuthentication,
  requirePermissions([Permission.ViewAllRoles]),
  safeParseRequest(getAllSchema),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requireAuthentication,
  requirePermissions([Permission.ViewAllRoles, Permission.UpdateRole]),
  safeParseRequest(updateSchema),
  processRequestWith(UpdateController)
);

export = roleRoutes;
