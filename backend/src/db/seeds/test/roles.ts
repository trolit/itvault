import { IRoleDefinition } from "types/config/IRoleDefinition";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export const ALL_PERMISSIONS_ROLE: IRoleDefinition = {
  name: HEAD_ADMIN_ROLE.name,

  description: "All permissions!!",

  permissions: PERMISSIONS_AS_ARRAY,
};

export const NO_PERMISSIONS_ROLE: IRoleDefinition = {
  name: "No permissions",

  description: "No permissions!!",

  permissions: [],
};
