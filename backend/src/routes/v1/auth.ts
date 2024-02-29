import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useSignInSuperSchema } from "@schemas/Auth/useSignInSuperSchema";
import { useDeleteSessionSuperSchema } from "@schemas/Auth/useDeleteSessionSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { SignInController } from "@controllers/Auth/SignInController";
import { StatusController } from "@controllers/Auth/StatusController";
import { SignOutController } from "@controllers/Auth/SignOutController";
import { GetSessionsController } from "@controllers/Auth/GetSessionsController";
import { DeleteSessionController } from "@controllers/Auth/DeleteSessionController";

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
  "/sign-out",
  requireEndpointVersion(SignOutController.ALL_VERSIONS),
  processRequestWith(SignOutController)
);

authRouter.get(
  "/status",
  requireEndpointVersion(StatusController.ALL_VERSIONS),
  requireAuthentication,
  processRequestWith(StatusController)
);

authRouter.get(
  "/sessions",
  requireEndpointVersion(GetSessionsController.ALL_VERSIONS),
  requireAuthentication,
  processRequestWith(GetSessionsController)
);

authRouter.delete(
  "/sessions/:id",
  requireAuthentication,
  validateRequestWith({ [v1]: useDeleteSessionSuperSchema }),
  processRequestWith(DeleteSessionController)
);
export = authRouter;
