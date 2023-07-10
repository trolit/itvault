import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useLoginSuperSchema } from "@schemas/Auth/useLoginSuperSchema";

import { LoginController } from "@controllers/Auth/LoginController";
import { StatusController } from "@controllers/Auth/StatusController";
import { LogoutController } from "@controllers/Auth/LogoutController";

const authRouter = Router();

authRouter.post(
  "/login",
  validateRequestWith(useLoginSuperSchema, {
    versions: LoginController.ALL_VERSIONS,
  }),
  processRequestWith(LoginController)
);

authRouter.post(
  "/logout",
  requireEndpointVersion(LogoutController.ALL_VERSIONS),
  processRequestWith(LogoutController)
);

authRouter.get(
  "/status",
  requireEndpointVersion(StatusController.ALL_VERSIONS),
  requireAuthentication,
  processRequestWith(StatusController)
);

export = authRouter;
