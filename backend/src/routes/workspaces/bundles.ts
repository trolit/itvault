import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { StoreController } from "@controllers/Bundle/StoreController";

const bundlesRouter = Router({ mergeParams: true });

bundlesRouter.use(requireWorkspaceAccess);

bundlesRouter.post("/v1", processRequestWith(StoreController));

export = bundlesRouter;
