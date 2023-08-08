import { Router } from "express";

import { FILES } from "@config";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { storeSchema } from "@schemas/Variant/storeSchema";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";
import { usePatchNameSuperSchema } from "@schemas/Variant/usePatchNameSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Variant/StoreController";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { GetByIdController } from "@controllers/Variant/GetByIdController";
import { PatchNameController } from "@controllers/Variant/PatchNameController";

const variantsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

variantsRouter.get(
  "/:variantId",
  requireEndpointVersion(GetByIdController.ALL_VERSIONS),
  processRequestWith(GetByIdController)
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
