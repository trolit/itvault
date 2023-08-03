import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useSignInSuperSchema } from "@schemas/Auth/useSignInSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StatusController } from "@controllers/Auth/StatusController";
import { SignInController } from "@controllers/Auth/SignInController";
import { LogoutController } from "@controllers/Auth/LogoutController";

const authRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

authRouter.post(
  "/sign-in",
  validateRequestWith({ [v1_0]: useSignInSuperSchema }),
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
  requireAuthentication,
  processRequestWith(StatusController)
);

export = authRouter;
