import { Router } from "express";

import { Permission } from "@enums/Permission";
import { getAllSchema } from "@schemas/User/getAllSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { updateManySchema } from "@schemas/User/updateManySchema";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const userRoutes = Router();

userRoutes.use(requireAuthentication);

userRoutes.get(
  "/v1",
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(getAllSchema),
  processRequestWith(GetAllController)
);

userRoutes.patch(
  "/v1",
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(updateManySchema),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
