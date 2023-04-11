import { Router } from "express";

import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication(),
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
