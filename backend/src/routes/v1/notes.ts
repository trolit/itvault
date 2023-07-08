import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/Note/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Note/useGetAllSuperSchema";

import { StoreController } from "@controllers/Note/StoreController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";

const notesRouter = Router();

notesRouter.use(requireAuthentication);

notesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

notesRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

notesRouter.delete("/:id", processRequestWith(SoftDeleteController));

export = notesRouter;
