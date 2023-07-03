import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Note/useStoreSuperSchema";

import { StoreController } from "@controllers/Note/StoreController";

const notesRouter = Router();

notesRouter.use(requireAuthentication);

notesRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

export = notesRouter;
