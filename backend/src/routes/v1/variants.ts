import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FILES } from "@config";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { addSchema } from "@schemas/Variant/addSchema";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";
import { usePatchNameSuperSchema } from "@schemas/Variant/usePatchNameSuperSchema";
import { useGetBlueprintsSuperSchema } from "@schemas/Variant/useGetBlueprintsSuperSchema";
import { useGetBucketControllerSuperSchema } from "@schemas/Variant/useGetBucketController";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Variant/AddController";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { GetBucketController } from "@controllers/Variant/GetBucketController";
import { PatchNameController } from "@controllers/Variant/PatchNameController";
import { SoftDeleteController } from "@controllers/Variant/SoftDeleteController";
import { GetBlueprintsController } from "@controllers/Variant/GetBlueprintsController";
import { GetContentByIdController } from "@controllers/Variant/GetContentByIdController";

const variantsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

variantsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
variantsRouter.use(IsWorkspaceAvailable);

variantsRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

variantsRouter.get(
  "/:id/content",
  requireEndpointVersion(GetContentByIdController.ALL_VERSIONS),
  processRequestWith(GetContentByIdController)
);

variantsRouter.get(
  "/:id/blueprints",
  validateRequestWith({ [v1]: useGetBlueprintsSuperSchema }),
  processRequestWith(GetBlueprintsController)
);

variantsRouter.get(
  "/:id/bucket",
  validateRequestWith({ [v1]: useGetBucketControllerSuperSchema }),
  processRequestWith(GetBucketController)
);

variantsRouter.post(
  "",
  requirePermissions([Permission.CreateVariant]),
  requireEndpointVersion(AddController.ALL_VERSIONS),
  parseUploadFormData(
    {
      multiples: false,
      basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
      fieldsOrder: ["name", "fileId"],
    },
    {
      fields: addSchema,
    }
  ),
  processRequestWith(AddController)
);

variantsRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteVariant]),
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

variantsRouter.put(
  "/:id/name",
  requirePermissions([Permission.UpdateVariantName]),
  validateRequestWith({ [v1]: usePatchNameSuperSchema }),
  processRequestWith(PatchNameController)
);

export = variantsRouter;
