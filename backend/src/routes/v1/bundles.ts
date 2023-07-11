import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Bundle/useStoreSuperSchema";

import { StoreController } from "@controllers/Bundle/StoreController";
import { RequeueController } from "@controllers/Bundle/RequeueController";
import { DownloadController } from "@controllers/Bundle/DownloadController";

const bundlesRouter = Router();

bundlesRouter.use(requireWorkspaceAccess);
bundlesRouter.use(IsWorkspaceAvailable);

bundlesRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

bundlesRouter.get(
  "/:id",
  requireEndpointVersion(DownloadController.ALL_VERSIONS),
  processRequestWith(DownloadController)
);

bundlesRouter.post(
  "/:id/requeue",
  requireEndpointVersion(RequeueController.ALL_VERSIONS),
  processRequestWith(RequeueController)
);

export = bundlesRouter;
