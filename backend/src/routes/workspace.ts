import { Router } from "express";

import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/Workspace/GetAllController";
import { requireAuthentication } from "@middlewares/requireAuthentication";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireAuthentication,
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
