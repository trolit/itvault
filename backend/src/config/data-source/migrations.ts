import { CreateUsersTable1665695149133 } from "@migrations/1665695149133-CreateUsersTable";
import { CreateWorkspacesTable1678565252340 } from "@migrations/1678565252340-CreateWorkspacesTable";
import { UpdatePasswordAttributeInWorkspaceEntity1678578515028 } from "@migrations/1678578515028-UpdatePasswordAttributeInWorkspaceEntity";
import { CreateBlueprintsTable1678582183597 } from "@migrations/1678582183597-CreateBlueprintsTable";
import { CreateRoleAndPermissionRelatedTables1679236763287 } from "@migrations/1679236763287-CreateRoleAndPermissionRelatedTables";
import { ExpandUserEntityWithRoleIdAttribute1679251676652 } from "@migrations/1679251676652-ExpandUserEntityWithRoleIdAttribute";
import { ExpandPermissionToRoleEntityWithEnabledAttribute1679252477776 } from "@migrations/1679252477776-ExpandPermissionToRoleEntityWithEnabledAttribute";
import { UpdateNameAttributeInPermissionEntity1679260617325 } from "@migrations/1679260617325-UpdateNameAttributeInPermissionEntity";
import { UpdateEnabledAttributeInPermissionToRoleEntity1679260845721 } from "@migrations/1679260845721-UpdateEnabledAttributeInPermissionToRoleEntity";
import { UpdateNameAttributeInRoleEntity1679261578188 } from "@migrations/1679261578188-UpdateNameAttributeInRoleEntity";
import { UpdateNameAttributeInWorkspaceEntity1683571095013 } from "@migrations/1683571095013-UpdateNameAttributeInWorkspaceEntity";

export const migrations = [
  CreateUsersTable1665695149133,
  CreateWorkspacesTable1678565252340,
  UpdatePasswordAttributeInWorkspaceEntity1678578515028,
  CreateBlueprintsTable1678582183597,
  CreateRoleAndPermissionRelatedTables1679236763287,
  ExpandUserEntityWithRoleIdAttribute1679251676652,
  ExpandPermissionToRoleEntityWithEnabledAttribute1679252477776,
  UpdateNameAttributeInPermissionEntity1679260617325,
  UpdateEnabledAttributeInPermissionToRoleEntity1679260845721,
  UpdateNameAttributeInRoleEntity1679261578188,
  UpdateNameAttributeInWorkspaceEntity1683571095013,
];
