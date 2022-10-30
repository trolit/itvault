import { Router } from "express";

import { loginSchema } from "@schemas/login";
import { LoginController } from "@controllers/Auth/Login";
import { processRequestWith } from "./processRequestWith";
import { validateRequestWith } from "@middlewares/validateRequestWith";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  validateRequestWith(loginSchema),
  processRequestWith(LoginController)
);

export = authRoutes;
