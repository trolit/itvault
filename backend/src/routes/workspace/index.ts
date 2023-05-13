import { Router } from "express";

import blueprintRoutes from "./blueprint";
import { getAllSchema } from "@schemas/workspace/getAllSchema";
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

workspaceRoutes.use("/:id/blueprints", blueprintRoutes);

export = workspaceRoutes;
