import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useAddSuperSchema } from "@schemas/Note/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Note/useGetAllSuperSchema";
import { usePatchValueSuperSchema } from "@schemas/Note/usePatchValueSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Note/AddController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { PatchValueController } from "@controllers/Note/PatchValueController";
import { SoftDeleteController } from "@controllers/Note/SoftDeleteController";

const notesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

notesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);
notesRouter.use(IsWorkspaceAvailable);

notesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

notesRouter.post(
  "",
  requirePermissions([Permission.CreateNote]),
  validateRequestWith({ [v1]: useAddSuperSchema }),
  processRequestWith(AddController)
);

notesRouter.patch(
  "/:id/value",
  validateRequestWith({ [v1]: usePatchValueSuperSchema }),
  processRequestWith(PatchValueController)
);

notesRouter.delete(
  "/:id",
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

export = notesRouter;
