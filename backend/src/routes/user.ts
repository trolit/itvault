import { Router } from "express";

import { Permission } from "@enums/Permission";
import { getAllSchema } from "@schemas/user/getAllSchema";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { updateManySchema } from "@schemas/user/updateManySchema";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const userRoutes = Router();

userRoutes.get(
  "/v1",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  safeParseRequest(getAllSchema),
  processRequestWith(GetAllController)
);

userRoutes.patch(
  "/v1",
  requireAuthentication,
  requirePermissions(UpdateManyController.isMissingPermissions),
  safeParseRequest(updateManySchema),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
