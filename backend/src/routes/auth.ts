import { Router } from "express";

import { LoginDto } from "@dtos/Login";
import { loginSchema } from "@schemas/login";
import { LoginController } from "@controllers/Auth/Login";
import { processRequestWith } from "./processRequestWith";
import { safeParseRequest } from "@middlewares/safeParseRequest";
import { TokenVerificationController } from "@controllers/Auth/TokenVerification";

const authRoutes = Router();

authRoutes.post(
  "/v1/login",
  safeParseRequest<LoginDto>(loginSchema),
  processRequestWith(LoginController)
);

authRoutes.get(
  "/v1/is-authenticated",
  processRequestWith(TokenVerificationController)
);

export = authRoutes;
