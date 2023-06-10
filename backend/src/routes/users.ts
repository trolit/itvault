import { Router } from "express";

import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { UpdateManyController } from "@controllers/User/UpdateManyController";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

const usersRoute = Router();

usersRoute.use(requireAuthentication);

usersRoute.get(
  "/v1",
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

usersRoute.patch(
  "/v1",
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(useUpdateManySuperSchema),
  processRequestWith(UpdateManyController)
);

export = usersRoute;
