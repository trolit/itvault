import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useMoveFilesSuperSchema } from "@schemas/Directory/useMoveFilesSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { MoveFilesController } from "@controllers/Directory/MoveFilesController";

const directoriesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

directoriesRouter.use(requireAuthentication);
directoriesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
directoriesRouter.use(IsWorkspaceAvailable);

directoriesRouter.post(
  "/move-files",
  requirePermissions([Permission.MoveFiles]),
  validateRequestWith({ [v1]: useMoveFilesSuperSchema }),
  processRequestWith(MoveFilesController)
);

export = directoriesRouter;
