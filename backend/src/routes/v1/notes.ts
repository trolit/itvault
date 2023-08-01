import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Note/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Note/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Note/useGetAllSuperSchema";

import { StoreController } from "@controllers/Note/StoreController";
import { UpdateController } from "@controllers/Note/UpdateController";
import { GetAllController } from "@controllers/Note/GetAllController";
import { SoftDeleteController } from "@controllers/Note/SoftDeleteController";

const notesRouter = Router();

notesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
  processRequestWith(GetAllController)
);

notesRouter.post(
  "",
  requirePermissions([Permission.CreateNote]),
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

notesRouter.put(
  "/:id",
  validateRequestWith(useUpdateSuperSchema, {
    versions: UpdateController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateController)
);

notesRouter.delete(
  "/:id",
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

export = notesRouter;
