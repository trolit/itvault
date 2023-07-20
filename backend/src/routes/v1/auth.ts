import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useSignInSuperSchema } from "@schemas/Auth/useSignInSuperSchema";

import { SignInController } from "@controllers/Auth/SignInController";
import { StatusController } from "@controllers/Auth/StatusController";
import { LogoutController } from "@controllers/Auth/LogoutController";

const authRouter = Router();

authRouter.post(
  "/sign-in",
  validateRequestWith(useSignInSuperSchema, {
    versions: SignInController.ALL_VERSIONS,
  }),
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
