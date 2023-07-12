import { CreateTagsTable1689180061786 } from "@migrations/1689180061786-CreateTagsTable";
import { CreateRolesTable1688323343704 } from "@migrations/1688323343704-CreateRolesTable";
import { CreateNotesTable1688324664250 } from "@migrations/1688324664250-CreateNotesTable";
import { CreateUsersTable1688323621217 } from "@migrations/1688323621217-CreateUsersTable";
import { CreateFilesTable1688323799964 } from "@migrations/1688323799964-CreateFilesTable";
import { CreateBucketsTable1688324598160 } from "@migrations/1688324598160-CreateBucketsTable";
import { CreateBundlesTable1688324413752 } from "@migrations/1688324413752-CreateBundlesTable";
import { CreateVariantsTable1688323924425 } from "@migrations/1688323924425-CreateVariantsTable";
import { CreateWorkspacesTable1688324097095 } from "@migrations/1688324097095-CreateWorkspacesTable";
import { CreateBlueprintsTable1688324013691 } from "@migrations/1688324013691-CreateBlueprintsTable";
import { CreatePermissionsTable1688323160526 } from "@migrations/1688323160526-CreatePermissionsTable";
import { CreateUsersToWorkspacesTable1688324250620 } from "@migrations/1688324250620-CreateUsersToWorkspacesTable";
import { CreatePermissionsToRolesTable1688323459863 } from "@migrations/1688323459863-CreatePermissionsToRolesTable";

export const migrations = [
  CreatePermissionsTable1688323160526,
  CreateRolesTable1688323343704,
  CreatePermissionsToRolesTable1688323459863,
  CreateUsersTable1688323621217,
  CreateFilesTable1688323799964,
  CreateVariantsTable1688323924425,
  CreateBlueprintsTable1688324013691,
  CreateWorkspacesTable1688324097095,
  CreateUsersToWorkspacesTable1688324250620,
  CreateBundlesTable1688324413752,
  CreateBucketsTable1688324598160,
  CreateNotesTable1688324664250,
  CreateTagsTable1689180061786,
];
