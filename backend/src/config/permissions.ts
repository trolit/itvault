import { Permission } from "@enums/Permission";
import { IPermission } from "@interfaces/IPermission";

const CREATE_ROLE_PERMISSION: IPermission = {
  id: Permission.CreateRole,
  name: "Create role",
};

const UPDATE_ROLE_PERMISSION: IPermission = {
  id: Permission.UpdateRole,
  name: "Update role",
};

/** @NOTE if 'false' - authenticated user receives only workflows to which is assigned  */
const VIEW_ALL_WORKFLOWS_PERMISSION: IPermission = {
  id: Permission.ViewAllWorkflows,
  name: "View all workflows",
};

const VIEW_ALL_USERS_PERMISSION: IPermission = {
  id: Permission.ViewAllUsers,
  name: "View all users",
};

const DEACTIVATE_USER_ACCOUNT_PERMISSION: IPermission = {
  id: Permission.DeactivateUserAccount,
  name: "Deactivate user account",
};

const CHANGE_USER_ROLE_PERMISSION: IPermission = {
  id: Permission.ChangeUserRole,
  name: "Change user role",
};

const RESTORE_USER_ACCOUNT_PERMISSION: IPermission = {
  id: Permission.RestoreUserAccount,
  name: "Restore user account",
};

export const ALL_PERMISSIONS = [
  CREATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
  VIEW_ALL_USERS_PERMISSION,
  CHANGE_USER_ROLE_PERMISSION,
  VIEW_ALL_WORKFLOWS_PERMISSION,
  RESTORE_USER_ACCOUNT_PERMISSION,
  DEACTIVATE_USER_ACCOUNT_PERMISSION,
];
