import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useStoreSuperSchema } from "@schemas/Bundle/useStoreSuperSchema";

import { StoreController } from "@controllers/Bundle/StoreController";
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

// @TODO consider "try to build again" route

export = bundlesRouter;
