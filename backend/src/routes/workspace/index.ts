import { Router } from "express";

import fileRoutes from "./file";
import blueprintRoutes from "./blueprint";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { useGetAllSuperSchema } from "@schemas/Workspace/useGetAllSuperSchema";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

// @TODO validate workspaceId in blueprint requests
workspaceRoutes.use("/:workspaceId/blueprints", blueprintRoutes);

// @TODO validate workspaceId in file requests
workspaceRoutes.use("/:workspaceId/files", fileRoutes);

export = workspaceRoutes;
