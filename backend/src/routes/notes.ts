import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Note/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Note/useGetAllSuperSchema";

import { StoreController } from "@controllers/Note/StoreController";
import { GetAllController } from "@controllers/Note/GetAllController";

const notesRouter = Router();

notesRouter.use(requireAuthentication);

notesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

notesRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

export = notesRouter;
