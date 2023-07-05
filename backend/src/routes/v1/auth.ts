import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useLoginSuperSchema } from "@schemas/Auth/useLoginSuperSchema";

import { LoginController } from "@controllers/Auth/LoginController";
import { StatusController } from "@controllers/Auth/StatusController";
import { LogoutController } from "@controllers/Auth/LogoutController";

const authRouter = Router();

authRouter.post(
  "/v1/login",
  validateRequestWith(useLoginSuperSchema),
  processRequestWith(LoginController)
);

authRouter.post("/v1/logout", processRequestWith(LogoutController));

authRouter.get("/v1/status", processRequestWith(StatusController));

export = authRouter;
