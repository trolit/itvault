import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useMoveFilesSuperSchema } from "@schemas/Directory/useMoveFilesSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { MoveFilesController } from "@controllers/Directory/MoveFilesController";

const directoriesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

directoriesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
directoriesRouter.use(IsWorkspaceAvailable);

// @TODO permission
directoriesRouter.post(
  "/move-files",
  validateRequestWith({ [v1]: useMoveFilesSuperSchema }),
  processRequestWith(MoveFilesController)
);

export = directoriesRouter;
