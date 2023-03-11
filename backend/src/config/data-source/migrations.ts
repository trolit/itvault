import { InitUsersTable1665695149133 } from "@migrations/1665695149133-InitUsersTable";
import { InitWorkspacesTable1678565252340 } from "@migrations/1678565252340-InitWorkspacesTable";
import { InitBlueprintsTable1678578515028 } from "@migrations/1678578515028-InitBlueprintsTable";
import { MarkWorkspacesTablePasswordColumnAsNullable1678578647291 } from "@migrations/1678578647291-MarkWorkspacesTablePasswordColumnAsNullable";

export const migrations = [
  InitUsersTable1665695149133,
  InitWorkspacesTable1678565252340,
  InitBlueprintsTable1678578515028,
  MarkWorkspacesTablePasswordColumnAsNullable1678578647291,
];
