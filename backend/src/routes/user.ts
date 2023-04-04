import { Router } from "express";

import { Di } from "@enums/Di";
import { User } from "@entities/User";
import { deleteSchema } from "@schemas/delete";
import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthentication } from "@middlewares/requireAuthentication";
import { SoftDeleteController } from "@controllers/User/SoftDeleteController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";
import { UPDATE_USER_PERMISSIONS } from "@config/permissions";

const userRoutes = Router();

userRoutes.get(
  "/v1",
  requireAuthentication({
    withPermission: Permission.ViewAllUsers,
  }),
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

userRoutes.delete(
  "/v1/:id",
  requireAuthentication({
    withPermission: Permission.DeactivateUserAccount,
  }),
  safeParseRequest({
    params: { withSchema: deleteSchema<User>(Di.UserRepository) },
  }),
  processRequestWith(SoftDeleteController)
);

userRoutes.patch(
  "/v1",
  requireAuthentication({
    withOneOfPermissions: UPDATE_USER_PERMISSIONS,
  }),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
