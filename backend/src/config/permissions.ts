import { Permission } from "@enums/Permission";
import { IPermissionDefinition } from "@interfaces/config/IPermissionDefinition";

// ****************************************************
// @NOTE BLUEPRINT PERMISSIONS
// ****************************************************

const CREATE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateBlueprint,
  name: "Create blueprint",
};

const UPDATE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateBlueprint,
  name: "Update blueprint",
};

const DELETE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteBlueprint,
  name: "Delete blueprint",
};

// ****************************************************
// @NOTE BUNDLE PERMISSIONS
// ****************************************************

const CREATE_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateBundle,
  name: "Create bundle",
};

const REQUEUE_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.RequeueBundle,
  name: "Requeue bundle",
};

const DOWNLOAD_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DownloadBundle,
  name: "Download bundle",
};

// ****************************************************
// @NOTE FILE PERMISSIONS
// ****************************************************

const UPLOAD_FILES_PERMISSION: IPermissionDefinition = {
  signature: Permission.UploadFiles,
  name: "Upload files",
};

const UPDATE_FILENAME_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateFilename,
  name: "Update filename",
};

const UPDATE_FILE_RELATIVE_PATH: IPermissionDefinition = {
  signature: Permission.UpdateFileRelativePath,
  name: "Update file relative path",
};

const REMOVE_FILE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteFile,
  name: "Delete file",
};

// ****************************************************
// @NOTE NOTE PERMISSIONS
// ****************************************************

const CREATE_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateNote,
  name: "Create note",
};

const UPDATE_ANY_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateAnyNote,
  name: "Update any note",
};

const DELETE_ANY_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteAnyNote,
  name: "Delete any note",
};

const VIEW_DELETED_NOTES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewDeletedNotes,
  name: "View deleted notes",
};

// ****************************************************
// @NOTE ROLE PERMISSIONS
// ****************************************************

const CREATE_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateRole,
  name: "Create role",
};

const UPDATE_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateRole,
  name: "Update role",
};

// ****************************************************
// @NOTE USER PERMISSIONS
// ****************************************************

const VIEW_ALL_USERS_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewAllUsers,
  name: "View all users",
};

const CREATE_USER_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateUser,
  name: "Create user",
};

const CHANGE_USER_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.ChangeUserRole,
  name: "Change user role",
};

const RESTORE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
  signature: Permission.RestoreUserAccount,
  name: "Restore user account",
};

const DEACTIVATE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeactivateUserAccount,
  name: "Deactivate user account",
};

// ****************************************************
// @NOTE VARIANT PERMISSIONS
// ****************************************************

const CREATE_VARIANT_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateVariant,
  name: "Create variant",
};

const DELETE_VARIANT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteVariant,
  name: "Delete variant",
};

const UPDATE_VARIANT_NAME: IPermissionDefinition = {
  signature: Permission.UpdateVariantName,
  name: "Update variant name",
};

const MANAGE_VARIANT_COLORING_PERMISSION: IPermissionDefinition = {
  signature: Permission.ManageVariantColoring,
  name: "Manage variant coloring",
};

// ****************************************************
// @NOTE WORKSPACE PERMISSIONS
// ****************************************************

const VIEW_ALL_WORKSPACES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewAllWorkspaces,
  name: "View all workspaces",
};

const CREATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateWorkspace,
  name: "Create workspace",
};

const UPDATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateWorkspace,
  name: "Update workspace",
};

export const ALL_PERMISSIONS = [
  CREATE_BLUEPRINT_PERMISSION,
  UPDATE_BLUEPRINT_PERMISSION,
  DELETE_BLUEPRINT_PERMISSION,

  CREATE_BUNDLE_PERMISSION,
  REQUEUE_BUNDLE_PERMISSION,
  DOWNLOAD_BUNDLE_PERMISSION,

  UPLOAD_FILES_PERMISSION,
  UPDATE_FILENAME_PERMISSION,
  UPDATE_FILE_RELATIVE_PATH,
  REMOVE_FILE_PERMISSION,

  CREATE_NOTE_PERMISSION,
  UPDATE_ANY_NOTE_PERMISSION,
  DELETE_ANY_NOTE_PERMISSION,
  VIEW_DELETED_NOTES_PERMISSION,

  CREATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,

  VIEW_ALL_USERS_PERMISSION,
  CREATE_USER_PERMISSION,
  CHANGE_USER_ROLE_PERMISSION,
  RESTORE_USER_ACCOUNT_PERMISSION,
  DEACTIVATE_USER_ACCOUNT_PERMISSION,

  CREATE_VARIANT_PERMISSION,
  DELETE_VARIANT_PERMISSION,
  UPDATE_VARIANT_NAME,
  MANAGE_VARIANT_COLORING_PERMISSION,

  VIEW_ALL_WORKSPACES_PERMISSION,
  CREATE_WORKSPACE_PERMISSION,
  UPDATE_WORKSPACE_PERMISSION,
];
