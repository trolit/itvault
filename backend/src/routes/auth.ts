import { Router } from "express";

import { loginSchema } from "@schemas/login";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { LoginController } from "@controllers/Auth/LoginController";
import { StatusController } from "@controllers/Auth/StatusController";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  safeParseRequest(loginSchema),
  processRequestWith(LoginController)
);

authRoutes.get("/v1/status", processRequestWith(StatusController));

export = authRoutes;
