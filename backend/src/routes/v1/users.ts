import { Router } from "express";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireAuthentication } from "@middleware/requireAuthentication";
import {
  requirePermissions,
  requirePermissionsCustomHandler,
} from "@middleware/requirePermissions";

import { useAddSuperSchema } from "@schemas/User/useAddSuperSchema";
import { useSignUpSuperSchema } from "@schemas/User/useSignUpSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useGetNotesSuperSchema } from "@schemas/User/useGetNotesSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";
import { usePatchUserToWorkspaceSuperSchema } from "@schemas/User/usePatchUserToWorkspaceSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/User/AddController";
import { GetAllController } from "@controllers/User/GetAllController";
import { SignUpController } from "@controllers/User/SignUpController";
import { GetNotesController } from "@controllers/User/GetNotesController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";
import { PatchUserToWorkspaceController } from "@controllers/User/PatchUserToWorkspaceController";

const usersRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

usersRouter.get(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

usersRouter.get(
  "/:id/notes",
  requireAuthentication,
  validateRequestWith({ [v1]: useGetNotesSuperSchema }),
  transformPagination({ defaultPerPage: GetNotesController.ITEMS_PER_PAGE }),
  processRequestWith(GetNotesController)
);

usersRouter.post(
  "",
  requireAuthentication,
  requirePermissions([Permission.CreateUser]),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

usersRouter.post(
  "/sign-up",
  validateRequestWith({ [v1]: useSignUpSuperSchema }),
  processRequestWith(SignUpController)
);

usersRouter.patch(
  "/:id/workspaces",
  requirePermissions([Permission.ManageUserWorkspaces]),
  validateRequestWith({ [v1]: usePatchUserToWorkspaceSuperSchema }),
  processRequestWith(PatchUserToWorkspaceController)
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
  validateRequestWith({ [v1]: useUpdateManySuperSchema }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
