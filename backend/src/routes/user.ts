import { Router } from "express";

import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { getAllSuperSchema } from "@schemas/User/getAllSuperSchema";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { updateManySuperSchema } from "@schemas/User/updateManySuperSchema";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const userRoutes = Router();

userRoutes.use(requireAuthentication);

userRoutes.get(
  "/v1",
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(getAllSuperSchema),
  processRequestWith(GetAllController)
);

userRoutes.patch(
  "/v1",
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(updateManySuperSchema),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
