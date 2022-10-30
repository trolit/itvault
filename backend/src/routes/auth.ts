import { Router } from "express";

import { LoginDto } from "@dtos/Login";
import { loginSchema } from "@schemas/login";
import { LoginController } from "@controllers/Auth/Login";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  safeParseRequest<LoginDto>(loginSchema),
  processRequestWith(LoginController)
);

export = authRoutes;
