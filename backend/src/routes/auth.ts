import { Router } from "express";

import { loginSchema } from "@schemas/auth/login";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "middleware/safeParseRequest";
import { LoginController } from "@controllers/Auth/LoginController";
import { StatusController } from "@controllers/Auth/StatusController";
import { LogoutController } from "@controllers/Auth/LogoutController";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  safeParseRequest({ body: { withSchema: loginSchema } }),
  processRequestWith(LoginController)
);

authRoutes.post("/v1/logout", processRequestWith(LogoutController));

authRoutes.get("/v1/status", processRequestWith(StatusController));

export = authRoutes;
