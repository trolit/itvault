import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Note/useStoreSuperSchema";

import { StoreController } from "@controllers/Note/StoreController";

const notesRouter = Router({ mergeParams: true });

notesRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

export = notesRouter;
