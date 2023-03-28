import { Router } from "express";

import { paginationSchema } from "@schemas/pagination";
import { processRequestWith } from "./processRequestWith";
import { validateToken } from "@middlewares/validateToken";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/Workspace/GetAllController";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  validateToken,
  safeParseRequest({ query: { withSchema: paginationSchema } }),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
