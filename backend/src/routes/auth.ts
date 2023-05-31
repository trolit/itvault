import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { LoginController } from "@controllers/Auth/LoginController";
import { LogoutController } from "@controllers/Auth/LogoutController";
import { StatusController } from "@controllers/Auth/StatusController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { useLoginSuperSchema } from "@schemas/Auth/useLoginSuperSchema";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  validateRequestWith(useLoginSuperSchema),
  processRequestWith(LoginController)
);

authRoutes.post("/v1/logout", processRequestWith(LogoutController));

authRoutes.get("/v1/status", processRequestWith(StatusController));

export = authRoutes;
