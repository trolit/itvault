import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { GetByIdController } from "@controllers/Variant/GetByIdController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

const variantRoutes = Router({ mergeParams: true });

variantRoutes.use(requireWorkspaceAccess);

variantRoutes.get("/:variantId/v1", processRequestWith(GetByIdController));

export = variantRoutes;
