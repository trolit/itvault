import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { GetAllController } from "@controllers/Permission/GetAllController";

const permissionsRouter = Router();

permissionsRouter.use(requireAuthentication);

permissionsRouter.get(
  "",
  requirePermissions([Permission.CreateRole]),
  requireEndpointVersion(GetAllController.ALL_VERSIONS),
  processRequestWith(GetAllController)
);

export = permissionsRouter;
