import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
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
  requirePermissions([Permission.DownloadBundle]),
  requireEndpointVersion(DownloadController.ALL_VERSIONS),
  processRequestWith(DownloadController)
);

bundlesRouter.post(
  "",
  requirePermissions([Permission.CreateBundle]),
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

bundlesRouter.post(
  "/:id/requeue",
  requirePermissions([Permission.RequeueBundle]),
  validateRequestWith(useRequeueSchema, {
    versions: RequeueController.ALL_VERSIONS,
  }),
  processRequestWith(RequeueController)
);

export = bundlesRouter;
