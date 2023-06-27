import { UpdateUsersTable1687880944635 } from "@migrations/1687880944635-UpdateUsersTable";
import { CreateFilesTable1685023186515 } from "@migrations/1685023186515-CreateFilesTable";
import { CreateUsersTable1665695149133 } from "@migrations/1665695149133-CreateUsersTable";
import { CreateBucketsTable1686234793370 } from "@migrations/1686234793370-CreateBucketsTable";
import { UpdateBundlesTable1687686325797 } from "@migrations/1687686325797-UpdateBundlesTable";
import { CreateBundlesTable1687029050338 } from "@migrations/1687029050338-CreateBundlesTable";
import { CreateVariantsTable1685024333420 } from "@migrations/1685024333420-CreateVariantsTable";
import { CreateBlueprintsTable1678582183597 } from "@migrations/1678582183597-CreateBlueprintsTable";
import { CreateWorkspacesTable1678565252340 } from "@migrations/1678565252340-CreateWorkspacesTable";
import { UpdateNamePropertyInRoleEntity1679261578188 } from "@migrations/1679261578188-UpdateNamePropertyInRoleEntity";
import { ExpandUserEntityWithRoleIdProperty1679251676652 } from "@migrations/1679251676652-ExpandUserEntityWithRoleIdProperty";
import { ExpandVariantEntityWithNameProperty1685044578245 } from "@migrations/1685044578245-ExpandVariantEntityWithNameProperty";
import { UpdateNamePropertyInWorkspaceEntity1683571095013 } from "@migrations/1683571095013-UpdateNamePropertyInWorkspaceEntity";
import { UpdateNamePropertyInPermissionEntity1679260617325 } from "@migrations/1679260617325-UpdateNamePropertyInPermissionEntity";
import { CreateRoleAndPermissionRelatedTables1679236763287 } from "@migrations/1679236763287-CreateRoleAndPermissionRelatedTables";
import { UpdatePasswordPropertyInWorkspaceEntity1678578515028 } from "@migrations/1678578515028-UpdatePasswordPropertyInWorkspaceEntity";
import { ExpandVariantEntityWithCreatedByProperty1687872465293 } from "@migrations/1687872465293-ExpandVariantEntityWithCreatedByProperty";
import { SetOneToManyRelationBetweenFileAndVariant1685030994778 } from "@migrations/1685030994778-SetOneToManyRelationBetweenFileAndVariant";
import { RemovePasswordPropertyFromWorkspaceEntity1687018579892 } from "@migrations/1687018579892-RemovePasswordPropertyFromWorkspaceEntity";
import { SetOneToManyRelationBetweenWorkspaceAndFile1685030356268 } from "@migrations/1685030356268-SetOneToManyRelationBetweenWorkspaceAndFile";
import { UpdateEnabledPropertyInPermissionToRoleEntity1679260845721 } from "@migrations/1679260845721-UpdateEnabledPropertyInPermissionToRoleEntity";
import { RemoveAccessPropertyFromUserToWorkspaceEntity1685798752314 } from "@migrations/1685798752314-RemoveAccessPropertyFromUserToWorkspaceEntity";
import { ExpandPermissionToRoleEntityWithEnabledProperty1679252477776 } from "@migrations/1679252477776-ExpandPermissionToRoleEntityWithEnabledProperty";
import { ChangeRelationBetweenBlueprintAndWorkspaceToOneToMany1686304172406 } from "@migrations/1686304172406-ChangeRelationBetweenBlueprintAndWorkspaceToOneToMany";

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
  CreateFilesTable1685023186515,
  CreateVariantsTable1685024333420,
  SetOneToManyRelationBetweenWorkspaceAndFile1685030356268,
  SetOneToManyRelationBetweenFileAndVariant1685030994778,
  ExpandVariantEntityWithNameProperty1685044578245,
  RemoveAccessPropertyFromUserToWorkspaceEntity1685798752314,
  CreateBucketsTable1686234793370,
  ChangeRelationBetweenBlueprintAndWorkspaceToOneToMany1686304172406,
  RemovePasswordPropertyFromWorkspaceEntity1687018579892,
  CreateBundlesTable1687029050338,
  UpdateBundlesTable1687686325797,
  ExpandVariantEntityWithCreatedByProperty1687872465293,
  UpdateUsersTable1687880944635,
];
