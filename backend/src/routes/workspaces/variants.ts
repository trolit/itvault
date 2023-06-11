import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { GetByIdController } from "@controllers/Variant/GetByIdController";

const variantsRouter = Router({ mergeParams: true });

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "/:variantId/v1/content",
  processRequestWith(GetByIdController)
);

export = variantsRouter;
