import { Router } from "express";

import { FILES } from "@config";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { storeSchema } from "@schemas/Variant/storeSchema";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";

import { StoreController } from "@controllers/Variant/StoreController";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { GetByIdController } from "@controllers/Variant/GetByIdController";

const variantsRouter = Router({ mergeParams: true });

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

variantsRouter.get("/:variantId", processRequestWith(GetByIdController));

variantsRouter.post(
  "",
  IsWorkspaceAvailable,
  parseUploadFormData(
    {
      multiples: false,
      basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
      fieldsOrder: ["name", "fileId", "variantId"],
    },
    storeSchema
  ),
  processRequestWith(StoreController)
);

export = variantsRouter;
