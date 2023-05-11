import { Router } from "express";

import { Permission } from "@enums/Permission";
import { getAllSchema } from "@schemas/role/getAllSchema";
import { updateSchema } from "@schemas/role/updateSchema";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/Role/GetAllController";
import { UpdateController } from "@controllers/Role/UpdateController";
import { requireAuthentication } from "@middleware/requireAuthentication";

const roleRoutes = Router();

roleRoutes.use(requireAuthentication);

roleRoutes.use(requirePermissions([Permission.ViewAllRoles]));

roleRoutes.get(
  "/v1",
  safeParseRequest(getAllSchema),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requirePermissions([Permission.UpdateRole]),
  safeParseRequest(updateSchema),
  processRequestWith(UpdateController)
);

export = roleRoutes;
