import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Workspace/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Workspace/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

import { StoreController } from "@controllers/Workspace/StoreController";
import { UpdateController } from "@controllers/Workspace/UpdateController";
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

workspacesRouter.put(
  "/:id",
  validateRequestWith(useUpdateSuperSchema, {
    versions: UpdateController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateController)
);

export = workspacesRouter;
