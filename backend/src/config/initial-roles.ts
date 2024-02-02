import { IRoleDefinition } from "types/config/IRoleDefinition";

export const MAINTAINER_ROLE: IRoleDefinition = {
  name: "Maintainer",

  permissions: [],
};

export const MEMBER_ROLE: IRoleDefinition = {
  name: "Member",

  permissions: [],
};

export const ALL_EDITABLE_ROLES = [MAINTAINER_ROLE, MEMBER_ROLE];
