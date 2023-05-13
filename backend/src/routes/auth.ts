import { Router } from "express";

import { loginSchema } from "@schemas/auth/loginSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { LoginController } from "@controllers/Auth/LoginController";
import { LogoutController } from "@controllers/Auth/LogoutController";
import { StatusController } from "@controllers/Auth/StatusController";
import { validateRequestWith } from "@middleware/validateRequestWith";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  validateRequestWith(loginSchema),
  processRequestWith(LoginController)
);

authRoutes.post("/v1/logout", processRequestWith(LogoutController));

authRoutes.get("/v1/status", processRequestWith(StatusController));

export = authRoutes;
