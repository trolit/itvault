import { Router } from "express";

import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
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
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

roleRoutes.put(
  "/v1/:id",
  requireAuthentication,
  requirePermissions([Permission.ViewAllRoles, Permission.UpdateRole]),
  processRequestWith(UpdateController)
);

export = roleRoutes;
