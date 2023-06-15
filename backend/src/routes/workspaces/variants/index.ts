import { Router } from "express";

import palettesRouter from "./palettes";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
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

variantsRouter.use("/:variantId/palettes", palettesRouter);

export = variantsRouter;
