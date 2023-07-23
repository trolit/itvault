import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useRequeueSchema } from "@schemas/Bundle/useRequeueSchema";
import { useStoreSuperSchema } from "@schemas/Bundle/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bundle/useGetAllSuperSchema";

import { StoreController } from "@controllers/Bundle/StoreController";
import { GetAllController } from "@controllers/Bundle/GetAllController";
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
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
  processRequestWith(GetAllController)
);

bundlesRouter.get(
  "/:id",
  requireEndpointVersion(DownloadController.ALL_VERSIONS),
  processRequestWith(DownloadController)
);

bundlesRouter.post(
  "/:id/requeue",
  validateRequestWith(useRequeueSchema, {
    versions: RequeueController.ALL_VERSIONS,
  }),
  processRequestWith(RequeueController)
);

export = bundlesRouter;
