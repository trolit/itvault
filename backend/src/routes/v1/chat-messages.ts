import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useAddSuperSchema } from "@schemas/ChatMessage/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/ChatMessage/useGetAllSuperSchema";
import { useHardDeleteSuperSchema } from "@schemas/ChatMessage/useHardDeleteSuperSchema";
import { usePatchValueSuperSchema } from "@schemas/ChatMessage/usePatchValueSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/ChatMessage/AddController";
import { GetAllController } from "@controllers/ChatMessage/GetAllController";
import { HardDeleteController } from "@controllers/ChatMessage/HardDeleteController";
import { PatchValueController } from "@controllers/ChatMessage/PatchValueController";

const chatMessagesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

chatMessagesRouter.use(requireAuthentication);

chatMessagesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

chatMessagesRouter.post(
  "",
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

chatMessagesRouter.patch(
  "/:id/value",
  validateRequestWith({ [v1]: usePatchValueSuperSchema }),
  processRequestWith(PatchValueController)
);

chatMessagesRouter.delete(
  "/:id",
  validateRequestWith({ [v1]: useHardDeleteSuperSchema }),
  processRequestWith(HardDeleteController)
);

export = chatMessagesRouter;
