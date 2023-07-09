import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

import { GetAllController } from "@controllers/User/GetAllController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const usersRouter = Router();

usersRouter.use(requireAuthentication);

usersRouter.get(
  "",
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

usersRouter.patch(
  "",
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(useUpdateManySuperSchema, {
    versions: UpdateManyController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
