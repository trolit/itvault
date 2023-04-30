import { Router } from "express";

import { getAllSchema } from "@schemas/workspace/getAllSchema";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication,
  safeParseRequest(getAllSchema),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
