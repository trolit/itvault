import { Router } from "express";

import { FILES } from "@config";
import palettesRouter from "./palettes";
import { fieldsSchema } from "@schemas/Variant/fieldsSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { StoreController } from "@controllers/Variant/StoreController";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { GetByIdController } from "@controllers/Variant/GetByIdController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { useGetAllSuperSchema } from "@schemas/Variant/useGetAllSuperSchema";

const variantsRouter = Router({ mergeParams: true });

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

variantsRouter.get("/:variantId/v1", processRequestWith(GetByIdController));

variantsRouter.post(
  "/v1",
  IsWorkspaceAvailable,
  parseUploadFormData(
    {
      multiples: false,
      basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
    },
    { fields: fieldsSchema }
  ),
  processRequestWith(StoreController)
);

variantsRouter.use("/:variantId/palettes", palettesRouter);

export = variantsRouter;
