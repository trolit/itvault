import { Router } from "express";

import { FILES } from "@config";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { storeSchema } from "@schemas/Variant/storeSchema";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";

import { StoreController } from "@controllers/Variant/StoreController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { GetByIdController } from "@controllers/Variant/GetByIdController";

const variantsRouter = Router();

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

variantsRouter.get(
  "/:variantId",
  requireEndpointVersion(GetByIdController.ALL_VERSIONS),
  processRequestWith(GetByIdController)
);

variantsRouter.post(
  "",
  requireEndpointVersion(StoreController.ALL_VERSIONS),
  requirePermissions([Permission.CreateVariant]),
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
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

export = variantsRouter;
