import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useAddSuperSchema } from "@schemas/ChatMessage/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/ChatMessage/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/ChatMessage/useUpdateSuperSchema";
import { useHardDeleteSuperSchema } from "@schemas/ChatMessage/useHardDeleteSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/ChatMessage/AddController";
import { UpdateController } from "@controllers/ChatMessage/UpdateController";
import { GetAllController } from "@controllers/ChatMessage/GetAllController";
import { HardDeleteController } from "@controllers/ChatMessage/HardDeleteController";

const chatMessagesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

chatMessagesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
chatMessagesRouter.use(IsWorkspaceAvailable);

chatMessagesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

chatMessagesRouter.post(
  "",
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

chatMessagesRouter.put(
  "/:id",
  validateRequestWith({ [v1]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

chatMessagesRouter.delete(
  "/:id",
  validateRequestWith({ [v1]: useHardDeleteSuperSchema }),
  processRequestWith(HardDeleteController)
);

export = chatMessagesRouter;
