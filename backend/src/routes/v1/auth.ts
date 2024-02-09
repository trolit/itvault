import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useSignInSuperSchema } from "@schemas/Auth/useSignInSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { SignInController } from "@controllers/Auth/SignInController";
import { StatusController } from "@controllers/Auth/StatusController";
import { LogoutController } from "@controllers/Auth/LogoutController";
import { GetSessionsController } from "@controllers/Auth/GetSessionsController";

const authRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

authRouter.post(
  "/sign-in",
  validateRequestWith({ [v1]: useSignInSuperSchema }),
  processRequestWith(SignInController)
);

authRouter.post(
  "/logout",
  requireEndpointVersion(LogoutController.ALL_VERSIONS),
  processRequestWith(LogoutController)
);

authRouter.get(
  "/status",
  requireEndpointVersion(StatusController.ALL_VERSIONS),
  processRequestWith(StatusController)
);

authRouter.get(
  "/sessions",
  requireEndpointVersion(GetSessionsController.ALL_VERSIONS),
  requireAuthentication,
  processRequestWith(GetSessionsController)
);

export = authRouter;
