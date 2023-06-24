import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { StoreController } from "@controllers/Bundle/StoreController";

const bundlesRouter = Router({ mergeParams: true });

bundlesRouter.use(requireWorkspaceAccess);

// @TODO validate if chosen variants target same file. IF NOT - DO NOT ALLOW FOR BUNDLE BUILD
bundlesRouter.post("/v1", processRequestWith(StoreController));

export = bundlesRouter;
