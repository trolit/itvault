import { InitUsersTable1665695149133 } from "@migrations/1665695149133-InitUsersTable";
import { InitWorkspacesTable1678565252340 } from "@migrations/1678565252340-InitWorkspacesTable";
import { UpdatePasswordAttributeOfWorkspacesTable1678578515028 } from "@migrations/1678578515028-UpdatePasswordAttributeOfWorkspacesTable";
import { InitBlueprintsTable1678582183597 } from "@migrations/1678582183597-InitBlueprintsTable";
import { InitRoleAndPermissionRelatedTables1679236763287 } from "@migrations/1679236763287-InitRoleAndPermissionRelatedTables";
import { AddRoleReferenceToUser1679251676652 } from "@migrations/1679251676652-AddRoleReferenceToUser";
import { ExpandPermissionToRoleWithEnabled1679252477776 } from "@migrations/1679252477776-ExpandPermissionToRoleWithEnabled";
import { MarkPermissionNamePropertyAsUnique1679260617325 } from "@migrations/1679260617325-MarkPermissionNamePropertyAsUnique";
import { SetDefaultOfEnabledPropertyInPermissionToRole1679260845721 } from "@migrations/1679260845721-SetDefaultOfEnabledPropertyInPermissionToRole";
import { MarkNameAsUniqueInRoleEntity1679261578188 } from "@migrations/1679261578188-MarkNameAsUniqueInRoleEntity";
import { MarkNameAsUniqueInWorkspaceEntity1683571095013 } from "@migrations/1683571095013-MarkNameAsUniqueInWorkspaceEntity";

export const migrations = [
  InitUsersTable1665695149133,
  InitWorkspacesTable1678565252340,
  UpdatePasswordAttributeOfWorkspacesTable1678578515028,
  InitBlueprintsTable1678582183597,
  InitRoleAndPermissionRelatedTables1679236763287,
  AddRoleReferenceToUser1679251676652,
  ExpandPermissionToRoleWithEnabled1679252477776,
  MarkPermissionNamePropertyAsUnique1679260617325,
  SetDefaultOfEnabledPropertyInPermissionToRole1679260845721,
  MarkNameAsUniqueInRoleEntity1679261578188,
  MarkNameAsUniqueInWorkspaceEntity1683571095013,
];
