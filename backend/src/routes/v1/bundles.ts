import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useRequeueSchema } from "@schemas/Bundle/useRequeueSchema";
import { useStoreSuperSchema } from "@schemas/Bundle/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bundle/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/Bundle/StoreController";
import { GetAllController } from "@controllers/Bundle/GetAllController";
import { RequeueController } from "@controllers/Bundle/RequeueController";
import { DownloadController } from "@controllers/Bundle/DownloadController";

const bundlesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

bundlesRouter.use(requireWorkspaceAccess);

bundlesRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
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
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

bundlesRouter.post(
  "/:id/requeue",
  requirePermissions([Permission.RequeueBundle]),
  validateRequestWith({ [v1_0]: useRequeueSchema }),
  processRequestWith(RequeueController)
);

export = bundlesRouter;
