import { roleNameToEmail } from "@db/seeds/helpers/roleNameToEmail";

import { MEMBER_ROLE } from "@config/initial-roles";

import { RuntimeData } from "./types/RuntimeData";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export const MEMBER_EMAIL = roleNameToEmail(MEMBER_ROLE.name);
export const HEAD_ADMIN_EMAIL = roleNameToEmail(HEAD_ADMIN_ROLE.name);
export const PASSWORD = "1234";

export const RUNTIME_DATA: RuntimeData = {
  tokens: {
    [MEMBER_EMAIL]: "",
    [HEAD_ADMIN_EMAIL]: "",
  },
};
