import { IRoleDefinition } from "@interfaces/IRoleDefinition";

export const HEAD_ADMIN_ROLE_NAME = "Head Admin";

export const ADMIN_ROLE: IRoleDefinition = {
  name: "Admin",

  permissions: [],
};

export const MEMBER_ROLE: IRoleDefinition = {
  name: "Member",

  permissions: [],
};

export const ALL_EDITABLE_ROLES = [ADMIN_ROLE, MEMBER_ROLE];
