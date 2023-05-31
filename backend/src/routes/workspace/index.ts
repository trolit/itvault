import { Router } from "express";

import fileRoutes from "./file";
import blueprintRoutes from "./blueprint";
import { getAllSchema } from "@schemas/Workspace/getAllSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(getAllSchema),
  processRequestWith(GetAllController)
);

// @TODO validate workspaceId in blueprint requests
workspaceRoutes.use("/:workspaceId/blueprints", blueprintRoutes);

// @TODO validate workspaceId in file requests
workspaceRoutes.use("/:workspaceId/files", fileRoutes);

export = workspaceRoutes;
