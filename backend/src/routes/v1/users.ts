import { Router } from "express";

import { Permission } from "@enums/Permission";

import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireValidEndpointVersion } from "@middleware/requireValidEndpointVersion";
import {
  processRequestWith,
  processRequestWith2,
} from "@helpers/processRequestWith";

import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

import { GetAllController } from "@controllers/User/GetAllController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const usersRouter = Router();

usersRouter.use(requireAuthentication);

usersRouter.get(
  "",
  requirePermissions([Permission.ViewAllUsers]),
  requireValidEndpointVersion(GetAllController.ALL_VERSIONS),
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith2(GetAllController)
);

usersRouter.patch(
  "",
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(useUpdateManySuperSchema),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
