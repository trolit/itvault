import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { GetContentController } from "@controllers/Variant/GetContentController";

const variantRoutes = Router({ mergeParams: true });

variantRoutes.use(requireWorkspaceAccess);

variantRoutes.get(
  "/:variantId/v1/content",
  processRequestWith(GetContentController)
);

export = variantRoutes;
