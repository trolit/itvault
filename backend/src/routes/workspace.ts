import { Router } from "express";

import { paginationSchema } from "@schemas/pagination";
import { requireToken } from "@middlewares/requireToken";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  requireToken,
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
