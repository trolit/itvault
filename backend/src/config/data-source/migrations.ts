import { InitUsersTable1665695149133 } from "@migrations/1665695149133-InitUsersTable";
import { InitWorkspacesTable1678565252340 } from "@migrations/1678565252340-InitWorkspacesTable";
import { MarkWorkspacesTablePasswordColumnAsNullable1678578647291 } from "@migrations/1678578515028-MarkWorkspacesTablePasswordColumnAsNullable";
import { InitBlueprintsTable1678582183597 } from "@migrations/1678582183597-InitBlueprintsTable";
import { InitRoleAndPermissionStructure1679236763287 } from "@migrations/1679236763287-InitRoleAndPermissionStructure";
import { AddRoleReferenceToUser1679251676652 } from "@migrations/1679251676652-AddRoleReferenceToUser";
import { ExpandPermissionToRoleWithEnabled1679252477776 } from "@migrations/1679252477776-ExpandPermissionToRoleWithEnabled";
import { MarkPermissionNamePropertyAsUnique1679260617325 } from "@migrations/1679260617325-MarkPermissionNamePropertyAsUnique";

export const migrations = [
  InitUsersTable1665695149133,
  InitWorkspacesTable1678565252340,
  MarkWorkspacesTablePasswordColumnAsNullable1678578647291,
  InitBlueprintsTable1678582183597,
  InitRoleAndPermissionStructure1679236763287,
  AddRoleReferenceToUser1679251676652,
  ExpandPermissionToRoleWithEnabled1679252477776,
  MarkPermissionNamePropertyAsUnique1679260617325,
];
