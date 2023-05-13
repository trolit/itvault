import { Permission } from "@enums/Permission";
import { IPermissionDefinition } from "@interfaces/config/IPermissionDefinition";

// ****************************************************
// @NOTE ROLE PERMISSIONS
// ****************************************************

const VIEW_ALL_ROLES_PERMISSION: IPermissionDefinition = {
  id: Permission.ViewAllRoles,
  name: "View all roles",
};

const CREATE_ROLE_PERMISSION: IPermissionDefinition = {
  id: Permission.CreateRole,
  name: "Create role",
};

const UPDATE_ROLE_PERMISSION: IPermissionDefinition = {
  id: Permission.UpdateRole,
  name: "Update role",
};

export const ALL_ROLE_PERMISSION_IDS = [
  VIEW_ALL_ROLES_PERMISSION.id,
  CREATE_ROLE_PERMISSION.id,
  UPDATE_ROLE_PERMISSION.id,
];

// ****************************************************
// @NOTE WORKSPACE PERMISSIONS
// ****************************************************

const VIEW_ALL_WORKSPACES_PERMISSION: IPermissionDefinition = {
  id: Permission.ViewAllWorkspaces,
  name: "View all workspaces",
};

const CREATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  id: Permission.CreateWorkspace,
  name: "Create workspace",
};

const UPDATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  id: Permission.UpdateWorkspace,
  name: "Update workspace",
};

export const ALL_WORKSPACE_PERMISSION_IDS = [
  VIEW_ALL_WORKSPACES_PERMISSION.id,
  CREATE_WORKSPACE_PERMISSION.id,
  UPDATE_WORKSPACE_PERMISSION.id,
];

// ****************************************************
// @NOTE USER PERMISSIONS
// ****************************************************

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

export const ALL_USER_PERMISSION_IDS: Permission[] = [
  CHANGE_USER_ROLE_PERMISSION.id,
  RESTORE_USER_ACCOUNT_PERMISSION.id,
  DEACTIVATE_USER_ACCOUNT_PERMISSION.id,
];

export const ALL_PERMISSIONS = [
  VIEW_ALL_ROLES_PERMISSION,
  CREATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,

  VIEW_ALL_WORKSPACES_PERMISSION,
  CREATE_WORKSPACE_PERMISSION,
  UPDATE_WORKSPACE_PERMISSION,

  VIEW_ALL_USERS_PERMISSION,
  DEACTIVATE_USER_ACCOUNT_PERMISSION,
  CHANGE_USER_ROLE_PERMISSION,
  RESTORE_USER_ACCOUNT_PERMISSION,
];
