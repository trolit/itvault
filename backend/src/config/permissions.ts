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

// ****************************************************
// @NOTE FILE PERMISSIONS
// ****************************************************

const UPLOAD_FILES_PERMISSION: IPermissionDefinition = {
  id: Permission.UploadFiles,
  name: "Upload files",
};

const REMOVE_FILE_PERMISSION: IPermissionDefinition = {
  id: Permission.RemoveFile,
  name: "Remove file",
};

const UPDATE_FILENAME_PERMISSION: IPermissionDefinition = {
  id: Permission.UpdateFilename,
  name: "Update filename",
};

const UPDATE_FILE_RELATIVE_PATH: IPermissionDefinition = {
  id: Permission.UpdateFileRelativePath,
  name: "Update file relative path",
};

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

  UPLOAD_FILES_PERMISSION,
  REMOVE_FILE_PERMISSION,
  UPDATE_FILENAME_PERMISSION,
  UPDATE_FILE_RELATIVE_PATH,
];
