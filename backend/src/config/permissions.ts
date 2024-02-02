import { IPermissionDefinition } from "types/config/IPermissionDefinition";

import { Permission } from "@shared/types/enums/Permission";
import { PermissionGroup } from "@shared/types/enums/PermissionGroup";

// ****************************************************
// @NOTE BLUEPRINT PERMISSIONS
// ****************************************************

const CREATE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateBlueprint,
  name: "Create blueprint",
  group: PermissionGroup.Blueprints,
};

const UPDATE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateBlueprint,
  name: "Update blueprint",
  group: PermissionGroup.Blueprints,
};

const DELETE_BLUEPRINT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteBlueprint,
  name: "Delete blueprint",
  group: PermissionGroup.Blueprints,
};

// ****************************************************
// @NOTE BUNDLE PERMISSIONS
// ****************************************************

const CREATE_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateBundle,
  name: "Create bundle",
  group: PermissionGroup.Bundles,
};

const REQUEUE_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.RequeueBundle,
  name: "Requeue bundle",
  group: PermissionGroup.Bundles,
};

const DOWNLOAD_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DownloadBundle,
  name: "Download bundle",
  group: PermissionGroup.Bundles,
};

const DELETE_ANY_BUNDLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteAnyBundle,
  name: "Delete any bundle",
  group: PermissionGroup.Bundles,
};

// @TODO delete any bundle permission

// ****************************************************
// @NOTE FILE PERMISSIONS
// ****************************************************

const UPLOAD_FILES_PERMISSION: IPermissionDefinition = {
  signature: Permission.UploadFiles,
  name: "Upload files",
  group: PermissionGroup.Files,
};

const UPDATE_FILENAME_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateFilename,
  name: "Update filename",
  group: PermissionGroup.Files,
};

const MOVE_FILES_PERMISSION: IPermissionDefinition = {
  signature: Permission.MoveFiles,
  name: "Move files",
  group: PermissionGroup.Files,
};

const REMOVE_FILE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteFile,
  name: "Delete file",
  group: PermissionGroup.Files,
};

// ****************************************************
// @NOTE NOTE PERMISSIONS
// ****************************************************

const CREATE_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateNote,
  name: "Create note",
  group: PermissionGroup.Notes,
};

const UPDATE_ANY_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateAnyNote,
  name: "Update any note",
  group: PermissionGroup.Notes,
};

const DELETE_ANY_NOTE_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteAnyNote,
  name: "Delete any note",
  group: PermissionGroup.Notes,
};

const VIEW_DELETED_NOTES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewDeletedNotes,
  name: "View deleted notes",
  group: PermissionGroup.Notes,
};

const VIEW_USER_NOTES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewUserNotes,
  name: "View user notes",
  group: PermissionGroup.Notes,
};

// ****************************************************
// @NOTE ROLE PERMISSIONS
// ****************************************************

const CREATE_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateRole,
  name: "Create role",
  group: PermissionGroup.Roles,
};

const UPDATE_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateRole,
  name: "Update role",
  group: PermissionGroup.Roles,
};

// ****************************************************
// @NOTE USER PERMISSIONS
// ****************************************************

const VIEW_ALL_USERS_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewAllUsers,
  name: "View all users",
  group: PermissionGroup.Users,
};

const CREATE_USER_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateUser,
  name: "Create user",
  group: PermissionGroup.Users,
};

const CHANGE_USER_ROLE_PERMISSION: IPermissionDefinition = {
  signature: Permission.ChangeUserRole,
  name: "Change user role",
  group: PermissionGroup.Users,
};

const RESTORE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
  signature: Permission.RestoreUserAccount,
  name: "Restore user account",
  group: PermissionGroup.Users,
};

const DEACTIVATE_USER_ACCOUNT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeactivateUserAccount,
  name: "Deactivate user account",
  group: PermissionGroup.Users,
};

const MANAGE_USER_WORKSPACES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ManageUserWorkspaces,
  name: "Manage workspaces accessible by user",
  group: PermissionGroup.Users,
};

// ****************************************************
// @NOTE VARIANT PERMISSIONS
// ****************************************************

const CREATE_VARIANT_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateVariant,
  name: "Create variant",
  group: PermissionGroup.Variants,
};

const DELETE_VARIANT_PERMISSION: IPermissionDefinition = {
  signature: Permission.DeleteVariant,
  name: "Delete variant",
  group: PermissionGroup.Variants,
};

const UPDATE_VARIANT_NAME: IPermissionDefinition = {
  signature: Permission.UpdateVariantName,
  name: "Update variant name",
  group: PermissionGroup.Variants,
};

const MANAGE_VARIANT_COLORING_PERMISSION: IPermissionDefinition = {
  signature: Permission.ManageVariantColoring,
  name: "Manage variant coloring",
  group: PermissionGroup.Variants,
};

// ****************************************************
// @NOTE WORKSPACE PERMISSIONS
// ****************************************************

const VIEW_ALL_WORKSPACES_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewAllWorkspaces,
  name: "View all workspaces",
  group: PermissionGroup.Workspaces,
};

const CREATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  signature: Permission.CreateWorkspace,
  name: "Create workspace",
  group: PermissionGroup.Workspaces,
};

const UPDATE_WORKSPACE_PERMISSION: IPermissionDefinition = {
  signature: Permission.UpdateWorkspace,
  name: "Update workspace",
  group: PermissionGroup.Workspaces,
};

const VIEW_WORKSPACE_INSIGHTS_PERMISSION: IPermissionDefinition = {
  signature: Permission.ViewWorkspaceInsights,
  name: "View insights",
  group: PermissionGroup.Workspaces,
};

export const ALL_PERMISSIONS = [
  CREATE_BLUEPRINT_PERMISSION,
  UPDATE_BLUEPRINT_PERMISSION,
  DELETE_BLUEPRINT_PERMISSION,

  CREATE_BUNDLE_PERMISSION,
  REQUEUE_BUNDLE_PERMISSION,
  DOWNLOAD_BUNDLE_PERMISSION,
  DELETE_ANY_BUNDLE_PERMISSION,

  UPLOAD_FILES_PERMISSION,
  UPDATE_FILENAME_PERMISSION,
  MOVE_FILES_PERMISSION,
  REMOVE_FILE_PERMISSION,

  CREATE_NOTE_PERMISSION,
  UPDATE_ANY_NOTE_PERMISSION,
  DELETE_ANY_NOTE_PERMISSION,
  VIEW_DELETED_NOTES_PERMISSION,
  VIEW_USER_NOTES_PERMISSION,

  CREATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,

  VIEW_ALL_USERS_PERMISSION,
  CREATE_USER_PERMISSION,
  CHANGE_USER_ROLE_PERMISSION,
  RESTORE_USER_ACCOUNT_PERMISSION,
  DEACTIVATE_USER_ACCOUNT_PERMISSION,
  MANAGE_USER_WORKSPACES_PERMISSION,

  CREATE_VARIANT_PERMISSION,
  DELETE_VARIANT_PERMISSION,
  UPDATE_VARIANT_NAME,
  MANAGE_VARIANT_COLORING_PERMISSION,

  VIEW_ALL_WORKSPACES_PERMISSION,
  CREATE_WORKSPACE_PERMISSION,
  UPDATE_WORKSPACE_PERMISSION,
  VIEW_WORKSPACE_INSIGHTS_PERMISSION,
];
