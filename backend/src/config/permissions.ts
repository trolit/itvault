import { Permission } from "@enums/Permission";
import { IPermissionDefinition } from "@interfaces/config/IPermissionDefinition";

const CREATE_ROLE_PERMISSION: IPermissionDefinition = {
  id: Permission.CreateRole,
  name: "Create role",
};

const UPDATE_ROLE_PERMISSION: IPermissionDefinition = {
  id: Permission.UpdateRole,
  name: "Update role",
};

/** @NOTE if 'false' - authenticated user receives only workflows to which is assigned  */
const VIEW_ALL_WORKFLOWS_PERMISSION: IPermissionDefinition = {
  id: Permission.ViewAllWorkflows,
  name: "View all workflows",
};

const VIEW_ALL_USERS_PERMISSION: IPermissionDefinition = {
  id: Permission.ViewAllUsers,
  name: "View all users",
};

const DEACTIVATE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
  id: Permission.DeactivateUserAccount,
  name: "Deactivate user account",
};

const CHANGE_USER_ROLE_PERMISSION: IPermissionDefinition = {
  id: Permission.ChangeUserRole,
  name: "Change user role",
};

const RESTORE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
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

export const UPDATE_USER_PERMISSIONS: Permission[] = [
  CHANGE_USER_ROLE_PERMISSION.id,
  RESTORE_USER_ACCOUNT_PERMISSION.id,
  DEACTIVATE_USER_ACCOUNT_PERMISSION.id,
];
