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
// @NOTE WORKFLOW PERMISSIONS
// ****************************************************

/** @NOTE if 'false' - authenticated user receives only workflows to which is assigned  */
const VIEW_ALL_WORKFLOWS_PERMISSION: IPermissionDefinition = {
  id: Permission.ViewAllWorkflows,
  name: "View all workflows",
};

const CREATE_WORKFLOW_PERMISSION: IPermissionDefinition = {
  id: Permission.CreateWorkflow,
  name: "Create workflow",
};

const UPDATE_WORKFLOW_PERMISSION: IPermissionDefinition = {
  id: Permission.UpdateWorkflow,
  name: "Update workflow",
};

export const ALL_WORKFLOW_PERMISSION_IDS = [
  VIEW_ALL_WORKFLOWS_PERMISSION.id,
  CREATE_WORKFLOW_PERMISSION.id,
  UPDATE_WORKFLOW_PERMISSION.id,
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

  VIEW_ALL_WORKFLOWS_PERMISSION,
  CREATE_WORKFLOW_PERMISSION,
  UPDATE_WORKFLOW_PERMISSION,

  VIEW_ALL_USERS_PERMISSION,
  DEACTIVATE_USER_ACCOUNT_PERMISSION,
  CHANGE_USER_ROLE_PERMISSION,
  RESTORE_USER_ACCOUNT_PERMISSION,
];
