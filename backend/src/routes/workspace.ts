import { Router } from "express";

import { processRequestWith } from "./processRequestWith";
import { StatusController } from "@controllers/Auth/Status";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { GetAllController } from "@controllers/Workspace/GetAll";

const workspaceRoutes = Router();

workspaceRoutes.get(
  "/v1",
  //   safeParseRequest<LoginDto>(loginSchema),
  processRequestWith(GetAllController)
);

export = workspaceRoutes;
