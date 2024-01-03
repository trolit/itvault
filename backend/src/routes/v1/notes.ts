import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useAddSuperSchema } from "@schemas/Note/useAddSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Note/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Note/useUpdateSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { AddController } from "@controllers/Note/AddController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { UpdateController } from "@controllers/Note/UpdateController";
import { SoftDeleteController } from "@controllers/Note/SoftDeleteController";

const notesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

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

notesRouter.put(
  "/:id",
  validateRequestWith({ [v1]: useUpdateSuperSchema }),
  processRequestWith(UpdateController)
);

notesRouter.delete(
  "/:id",
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

export = notesRouter;
