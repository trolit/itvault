import path from "path";
import { roleNameToEmail } from "@db/seeds/helpers/roleNameToEmail";

import { MEMBER_ROLE } from "@config/initial-roles";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export const MEMBER_EMAIL = roleNameToEmail(MEMBER_ROLE.name);
export const HEAD_ADMIN_EMAIL = roleNameToEmail(HEAD_ADMIN_ROLE.name);
export const PASSWORD = "1234";

export const TESTS_TIMEOUT = "10s";
export const RUNTIME_DATA_DI_TOKEN = "IRuntimeData";
export const PATH_TO_CONTROLLERS_TESTS = path.join(__dirname, "controllers");

export const ROUTER_VERSION_PREFIX = "v";
