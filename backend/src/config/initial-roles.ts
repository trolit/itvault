import { IRoleDefinition } from "types/config/IRoleDefinition";

import { PERMISSIONS_AS_OBJECT, PERMISSIONS_AS_ARRAY } from "./permissions";

import { HEAD_ADMIN_ROLE as HEAD_ADMIN_ROLE_DATA } from "@shared/constants/config";

const {
  MOVE_FILES_PERMISSION,
  CREATE_NOTE_PERMISSION,
  REMOVE_FILE_PERMISSION,
  UPLOAD_FILES_PERMISSION,
  UPDATE_ANY_NOTE_PERMISSION,
  UPDATE_FILENAME_PERMISSION,
  CREATE_BLUEPRINT_PERMISSION,
  UPDATE_BLUEPRINT_PERMISSION,
} = PERMISSIONS_AS_OBJECT;

const HEAD_ADMIN_ROLE: IRoleDefinition = {
  name: HEAD_ADMIN_ROLE_DATA.name,

  description: "Head of application",

  permissions: PERMISSIONS_AS_ARRAY,
};

const MAINTAINER_ROLE: IRoleDefinition = {
  name: "Maintainer",

  description: "Role capable of workspace management",

  permissions: [
    CREATE_NOTE_PERMISSION,
    UPDATE_ANY_NOTE_PERMISSION,

    CREATE_BLUEPRINT_PERMISSION,
    UPDATE_BLUEPRINT_PERMISSION,

    MOVE_FILES_PERMISSION,
    REMOVE_FILE_PERMISSION,
    UPLOAD_FILES_PERMISSION,
    UPDATE_FILENAME_PERMISSION,
  ],
};

export const MEMBER_ROLE: IRoleDefinition = {
  name: "Member",

  description: "Regular user of application",

  permissions: [CREATE_NOTE_PERMISSION],
};

export const INITIAL_ROLES = [HEAD_ADMIN_ROLE, MAINTAINER_ROLE, MEMBER_ROLE];
