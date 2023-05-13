import { CreateUsersTable1665695149133 } from "@migrations/1665695149133-CreateUsersTable";
import { CreateWorkspacesTable1678565252340 } from "@migrations/1678565252340-CreateWorkspacesTable";
import { UpdatePasswordPropertyInWorkspaceEntity1678578515028 } from "@migrations/1678578515028-UpdatePasswordPropertyInWorkspaceEntity";
import { CreateBlueprintsTable1678582183597 } from "@migrations/1678582183597-CreateBlueprintsTable";
import { CreateRoleAndPermissionRelatedTables1679236763287 } from "@migrations/1679236763287-CreateRoleAndPermissionRelatedTables";
import { ExpandUserEntityWithRoleIdProperty1679251676652 } from "@migrations/1679251676652-ExpandUserEntityWithRoleIdProperty";
import { ExpandPermissionToRoleEntityWithEnabledProperty1679252477776 } from "@migrations/1679252477776-ExpandPermissionToRoleEntityWithEnabledProperty";
import { UpdateNamePropertyInPermissionEntity1679260617325 } from "@migrations/1679260617325-UpdateNamePropertyInPermissionEntity";
import { UpdateEnabledPropertyInPermissionToRoleEntity1679260845721 } from "@migrations/1679260845721-UpdateEnabledPropertyInPermissionToRoleEntity";
import { UpdateNamePropertyInRoleEntity1679261578188 } from "@migrations/1679261578188-UpdateNamePropertyInRoleEntity";
import { UpdateNamePropertyInWorkspaceEntity1683571095013 } from "@migrations/1683571095013-UpdateNamePropertyInWorkspaceEntity";

export const migrations = [
  CreateUsersTable1665695149133,
  CreateWorkspacesTable1678565252340,
  UpdatePasswordPropertyInWorkspaceEntity1678578515028,
  CreateBlueprintsTable1678582183597,
  CreateRoleAndPermissionRelatedTables1679236763287,
  ExpandUserEntityWithRoleIdProperty1679251676652,
  ExpandPermissionToRoleEntityWithEnabledProperty1679252477776,
  UpdateNamePropertyInPermissionEntity1679260617325,
  UpdateEnabledPropertyInPermissionToRoleEntity1679260845721,
  UpdateNamePropertyInRoleEntity1679261578188,
  UpdateNamePropertyInWorkspaceEntity1683571095013,
];
