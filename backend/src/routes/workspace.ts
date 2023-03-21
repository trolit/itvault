import { Router } from "express";

import { processRequestWith } from "./processRequestWith";
import { validateToken } from "@middlewares/validateToken";
import { GetAllController } from "@controllers/Workspace/GetAll";

const workspaceRoutes = Router();

workspaceRoutes.get("/v1", validateToken, processRequestWith(GetAllController));

export = workspaceRoutes;
