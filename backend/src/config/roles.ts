import { IRole } from "@interfaces/IRole";

export const HEAD_ADMIN_ROLE_NAME = "Head Admin";

export const ADMIN_ROLE: IRole = {
  name: "Head Admin",

  permissions: [],
};

export const MEMBER_ROLE: IRole = {
  name: "Member",

  permissions: [],
};

export const ALL_EDITABLE_ROLES = [ADMIN_ROLE, MEMBER_ROLE];
