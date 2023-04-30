import { Router } from "express";

import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { updateManyUsersSchema } from "@schemas/user/updateMany";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const userRoutes = Router();

userRoutes.get(
  "/v1",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

userRoutes.patch(
  "/v1",
  requireAuthentication,
  requirePermissions(UpdateManyController.isMissingPermissions),
  safeParseRequest(updateManyUsersSchema),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
