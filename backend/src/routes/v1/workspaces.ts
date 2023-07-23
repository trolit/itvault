import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Workspace/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Workspace/useUpdateSuperSchema";

import { StoreController } from "@controllers/Workspace/StoreController";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { UpdateController } from "@controllers/Workspace/UpdateController";

const workspacesRouter = Router();

workspacesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
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
