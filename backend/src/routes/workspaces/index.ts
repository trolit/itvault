import { Router } from "express";

import filesRouter from "./files";
import variantsRouter from "./variants";
import blueprintsRouter from "./blueprints";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

const workspacesRouter = Router();

workspacesRouter.use(requireAuthentication);

workspacesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

workspacesRouter.use("/:workspaceId/blueprints", blueprintsRouter);

workspacesRouter.use("/:workspaceId/files", filesRouter);

workspacesRouter.use("/:workspaceId/variants", variantsRouter);

export = workspacesRouter;
