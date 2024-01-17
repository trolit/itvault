import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useAddSuperSchema } from "@schemas/ChatMessage/useAddSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/ChatMessage/AddController";

const chatMessagesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

chatMessagesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
chatMessagesRouter.use(IsWorkspaceAvailable);

chatMessagesRouter.post(
  "",
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

export = chatMessagesRouter;
