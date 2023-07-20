import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/User/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

import { StoreController } from "@controllers/User/StoreController";
import { GetAllController } from "@controllers/User/GetAllController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const usersRouter = Router();

usersRouter.get(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

usersRouter.post(
  "",
  requireAuthentication,
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

usersRouter.patch(
  "",
  requireAuthentication,
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(useUpdateManySuperSchema, {
    versions: UpdateManyController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
