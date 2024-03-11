import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useAddSuperSchema } from "@schemas/Blueprint/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Blueprint/useUpdateSuperSchema";
import { getTogglePinSuperSchema } from "@schemas/common/getTogglePinSuperSchema";

import { PinController } from "@controllers/PinController";
import { BaseController } from "@controllers/BaseController";
import { UnpinController } from "@controllers/UnpinController";
import { AddController } from "@controllers/Blueprint/AddController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

blueprintsRouter.use(requireAuthentication);
blueprintsRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
blueprintsRouter.use(IsWorkspaceAvailable);

blueprintsRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

blueprintsRouter.post(
  "",
  requirePermissions([Permission.CreateBlueprint]),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

blueprintsRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteBlueprint]),
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

blueprintsRouter.post(
  "/:id/pin",
  requirePermissions([Permission.UpdateBlueprint]),
  validateRequestWith({
    [v1]: getTogglePinSuperSchema(Di.BlueprintRepository),
  }),
  processRequestWith(PinController)
);

blueprintsRouter.post(
  "/:id/unpin",
  requirePermissions([Permission.UpdateBlueprint]),
  validateRequestWith({
    [v1]: getTogglePinSuperSchema(Di.BlueprintRepository),
  }),
  processRequestWith(UnpinController)
);

blueprintsRouter.put(
  "/:id",
  requirePermissions([Permission.UpdateBlueprint]),
  validateRequestWith({ [v1]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

export = blueprintsRouter;
