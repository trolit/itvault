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

import { storeSchema } from "@schemas/Variant/storeSchema";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";
import { usePatchNameSuperSchema } from "@schemas/Variant/usePatchNameSuperSchema";
import { useGetAllBlueprintsSchema } from "@schemas/Variant/useGetAllBlueprintsSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Variant/StoreController";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { PatchNameController } from "@controllers/Variant/PatchNameController";
import { GetContentByIdController } from "@controllers/Variant/GetContentByIdController";
import { GetAllBlueprintsController } from "@controllers/Variant/GetAllBlueprintsController";

const variantsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

variantsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);

variantsRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

variantsRouter.get(
  "/:id/content",
  requireEndpointVersion(GetContentByIdController.ALL_VERSIONS),
  processRequestWith(GetContentByIdController)
);

variantsRouter.get(
  "/:id/blueprints",
  validateRequestWith({ [v1_0]: useGetAllBlueprintsSchema }),
  processRequestWith(GetAllBlueprintsController)
);

variantsRouter.post(
  "",
  requirePermissions([Permission.CreateVariant]),
  requireEndpointVersion(StoreController.ALL_VERSIONS),
  IsWorkspaceAvailable,
  parseUploadFormData(
    {
      multiples: false,
      basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
      fieldsOrder: ["name", "fileId", "variantId"],
    },
    {
      fields: storeSchema,
    }
  ),
  processRequestWith(StoreController)
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
  validateRequestWith({ [v1_0]: usePatchNameSuperSchema }),
  processRequestWith(PatchNameController)
);

export = variantsRouter;
