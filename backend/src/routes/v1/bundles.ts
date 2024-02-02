import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useRequeueSchema } from "@schemas/Bundle/useRequeueSchema";
import { useAddSuperSchema } from "@schemas/Bundle/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bundle/useGetAllSuperSchema";
import { useGetFilesSuperSchema } from "@schemas/Bundle/useGetFilesSuperSchema";
import { useGetBlueprintsSuperSchema } from "@schemas/Bundle/useGetBlueprintsSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Bundle/AddController";
import { GetAllController } from "@controllers/Bundle/GetAllController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { RequeueController } from "@controllers/Bundle/RequeueController";
import { DownloadController } from "@controllers/Bundle/DownloadController";
import { GetFilesController } from "@controllers/Bundle/GetFilesController";
import { GetBlueprintsController } from "@controllers/Bundle/GetBlueprintsController";

const bundlesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

bundlesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
bundlesRouter.use(IsWorkspaceAvailable);

bundlesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

bundlesRouter.get(
  "/:id",
  requirePermissions([Permission.DownloadBundle]),
  requireEndpointVersion(DownloadController.ALL_VERSIONS),
  processRequestWith(DownloadController)
);

bundlesRouter.get(
  "/:id/blueprints",
  validateRequestWith({ [v1]: useGetBlueprintsSuperSchema }),
  processRequestWith(GetBlueprintsController)
);

bundlesRouter.get(
  "/:id/files",
  validateRequestWith({ [v1]: useGetFilesSuperSchema }),
  processRequestWith(GetFilesController)
);

bundlesRouter.post(
  "",
  requirePermissions([Permission.CreateBundle]),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

bundlesRouter.post(
  "/:id/requeue",
  requirePermissions([Permission.RequeueBundle]),
  validateRequestWith({ [v1]: useRequeueSchema }),
  processRequestWith(RequeueController)
);

bundlesRouter.delete(
  "/:id",
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

export = bundlesRouter;
