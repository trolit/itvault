import { Router } from "express";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { processRequestWith } from "@helpers/processRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import {
  requirePermissions,
  requirePermissionsCustomHandler,
} from "@middleware/requirePermissions";

import { useStoreSuperSchema } from "@schemas/User/useStoreSuperSchema";
import { useSignUpSuperSchema } from "@schemas/User/useSignUpSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useGetNotesSuperSchema } from "@schemas/User/useGetNotesSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/User/StoreController";
import { GetAllController } from "@controllers/User/GetAllController";
import { SignUpController } from "@controllers/User/SignUpController";
import { GetNotesController } from "@controllers/User/GetNotesController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

const usersRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

usersRouter.get(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

usersRouter.get(
  "/:id/notes",
  validateRequestWith({ [v1_0]: useGetNotesSuperSchema }),
  transformPagination({ defaultPerPage: GetNotesController.ITEMS_PER_PAGE }),
  processRequestWith(GetNotesController)
);

usersRouter.post(
  "",
  requireAuthentication,
  requirePermissions([Permission.CreateUser]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

usersRouter.post(
  "/sign-up",
  validateRequestWith({ [v1_0]: useSignUpSuperSchema }),
  processRequestWith(SignUpController)
);

usersRouter.patch(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  requirePermissionsCustomHandler<
    void,
    UpdateManyControllerTypes.v1.Body,
    void
  >(({ permissions, body }) => {
    const [canRestoreAccount, canDeactivateAccount, canChangeRole] = [
      isPermissionEnabled(Permission.RestoreUserAccount, permissions),
      isPermissionEnabled(Permission.DeactivateUserAccount, permissions),
      isPermissionEnabled(Permission.ChangeUserRole, permissions),
    ];

    const isActivePropertyCheck = (isActive?: boolean) => {
      if (isActive === undefined) {
        return false;
      }

      return isActive ? !canRestoreAccount : !canDeactivateAccount;
    };

    const isMissingPermission = body.values.some(
      ({ data }) =>
        isActivePropertyCheck(data.isActive) || (data.roleId && !canChangeRole)
    );

    return !isMissingPermission;
  }),
  validateRequestWith({ [v1_0]: useUpdateManySuperSchema }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
