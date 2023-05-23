import { Router } from "express";

import fileRoutes from "./file";
import blueprintRoutes from "./blueprint";
import { getAllSchema } from "@schemas/Workspace/getAllSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { childrenRouteEntrySchema } from "@schemas/Workspace/childrenRouteEntrySchema";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(getAllSchema),
  processRequestWith(GetAllController)
);

workspaceRoutes.use(
  "/:id/blueprints",
  [validateRequestWith(childrenRouteEntrySchema)],
  blueprintRoutes
);

workspaceRoutes.use(
  "/:id/files",
  [validateRequestWith(childrenRouteEntrySchema)],
  fileRoutes
);

export = workspaceRoutes;
