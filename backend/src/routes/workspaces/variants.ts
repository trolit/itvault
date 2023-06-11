import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { GetAllController } from "@controllers/Variant/GetAllController";
import { GetByIdController } from "@controllers/Variant/GetByIdController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

const variantsRouter = Router({ mergeParams: true });

variantsRouter.use(requireWorkspaceAccess);

variantsRouter.get("/v1", processRequestWith(GetAllController));

variantsRouter.get("/:variantId/v1", processRequestWith(GetByIdController));

export = variantsRouter;
