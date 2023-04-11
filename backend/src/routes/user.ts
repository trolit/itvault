import { Router } from "express";

import { Di } from "@enums/Di";
import { User } from "@entities/User";
import { deleteSchema } from "@schemas/delete";
import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
import { updateUsersSchema } from "@schemas/user/update";
import { processRequestWith } from "./processRequestWith";
import { ALL_USER_PERMISSION_IDS } from "@config/permissions";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { SoftDeleteController } from "@controllers/User/SoftDeleteController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

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
    withPermission: Permission.ViewAllUsers,
    withOneOfPermissions: ALL_USER_PERMISSION_IDS,
  }),
  safeParseRequest({
    body: { withSchema: updateUsersSchema },
  }),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
