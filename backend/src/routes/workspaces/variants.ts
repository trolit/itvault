import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { GetContentController } from "@controllers/Variant/GetContentController";

const variantsRouter = Router({ mergeParams: true });

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get(
  "/:variantId/v1/content",
  processRequestWith(GetContentController)
);

export = variantsRouter;
