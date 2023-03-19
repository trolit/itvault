import { IPermission } from "@interfaces/IPermission";
import { Permission } from "@enums/Permission";

export const CREATE_ROLE_PERMISSION: IPermission = {
  id: Permission.CreateRole,
  name: "Create role",
};

export const UPDATE_ROLE_PERMISSION: IPermission = {
  id: Permission.UpdateRole,
  name: "Update role",
};

export const VIEW_ALL_WORKFLOWS_PERMISSION: IPermission = {
  id: Permission.ViewAllWorkflows,
  name: "View all workflows",
};

export const ALL_PERMISSIONS = [
  CREATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
  VIEW_ALL_WORKFLOWS_PERMISSION,
];
