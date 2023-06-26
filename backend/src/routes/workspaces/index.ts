import { Router } from "express";

import filesRouter from "./files";
import bucketsRouter from "./buckets";
import bundlesRouter from "./bundles";
import variantsRouter from "./variants";
import blueprintsRouter from "./blueprints";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspacesRouter = Router();

workspacesRouter.use(requireAuthentication);

workspacesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

workspacesRouter.use("/:workspaceId/files", filesRouter);

workspacesRouter.use("/:workspaceId/variants", variantsRouter);

workspacesRouter.use("/:workspaceId/blueprints", blueprintsRouter);

workspacesRouter.use("/:workspaceId/bundles", bundlesRouter);

workspacesRouter.use("/:workspaceId/buckets", bucketsRouter);

export = workspacesRouter;
