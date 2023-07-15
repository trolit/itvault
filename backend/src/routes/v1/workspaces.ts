import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Workspace/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

import { StoreController } from "@controllers/Workspace/StoreController";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspacesRouter = Router();

workspacesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

workspacesRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

export = workspacesRouter;
