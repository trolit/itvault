import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useStoreSuperSchema } from "@schemas/Bundle/useStoreSuperSchema";

import { StoreController } from "@controllers/Bundle/StoreController";
import { DownloadController } from "@controllers/Bundle/DownloadController";

const bundlesRouter = Router({ mergeParams: true });

bundlesRouter.use(requireWorkspaceAccess);
bundlesRouter.use(IsWorkspaceAvailable);

// @TODO validate if chosen variants target same file. IF NOT - DO NOT ALLOW FOR BUNDLE BUILD
bundlesRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

bundlesRouter.get("/v1/:id", processRequestWith(DownloadController));

// @TODO consider "try to build again" route

export = bundlesRouter;
