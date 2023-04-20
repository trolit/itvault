import { Router } from "express";

import { Di } from "@enums/Di";
import { deleteSchema } from "@schemas/delete";
import { Permission } from "@enums/Permission";
import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { updateManyUsersSchema } from "@schemas/user/updateMany";
import { requirePermissions } from "@middleware/requirePermissions";
import { GetAllController } from "@controllers/User/GetAllController";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { SoftDeleteController } from "@controllers/User/SoftDeleteController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const userRoutes = Router();

userRoutes.get(
  "/v1",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

// @DEPRECATED (delete is handled through `patch` deletedAt)
userRoutes.delete(
  "/v1/:id",
  requireAuthentication,
  requirePermissions([Permission.DeactivateUserAccount]),
  safeParseRequest({
    params: { withSchema: deleteSchema },
    data: { repository: Di.UserRepository },
  }),
  processRequestWith(SoftDeleteController)
);

userRoutes.patch(
  "/v1",
  requireAuthentication,
  requirePermissions(UpdateManyController.hasMissingPermissions),
  safeParseRequest({
    body: { withSchema: updateManyUsersSchema },
  }),
  processRequestWith(UpdateManyController)
);

export = userRoutes;
