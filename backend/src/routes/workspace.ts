import { Router } from "express";

import { processRequestWith } from "./processRequestWith";
import { GetAllController } from "@controllers/Workspace/GetAll";

const workspaceRoutes = Router();

workspaceRoutes.get("/v1", processRequestWith(GetAllController));

export = workspaceRoutes;
