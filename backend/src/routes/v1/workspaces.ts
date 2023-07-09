import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspacesRouter = Router();

workspacesRouter.use(requireAuthentication);

workspacesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

export = workspacesRouter;
