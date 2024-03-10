import { IRoleDefinition } from "types/config/IRoleDefinition";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

export const ALL_PERMISSIONS_ROLE: IRoleDefinition = {
  name: "All permissions",

  description: "All permissions!!",

  permissions: PERMISSIONS_AS_ARRAY,
};

export const NO_PERMISSIONS_ROLE: IRoleDefinition = {
  name: "No permissions",

  description: "No permissions!!",

  permissions: [],
};
