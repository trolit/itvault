import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Blueprint/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Blueprint/useUpdateSuperSchema";

import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { StoreController } from "@controllers/Blueprint/StoreController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";

const blueprintsRouter = Router();

blueprintsRouter.use(requireWorkspaceAccess);

blueprintsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
  processRequestWith(GetAllController)
);

blueprintsRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

blueprintsRouter.delete(
  "/:id",
  requireEndpointVersion(SoftDeleteController.ALL_VERSIONS),
  processRequestWith(SoftDeleteController)
);

blueprintsRouter.put(
  "/:id",
  validateRequestWith(useUpdateSuperSchema, {
    versions: UpdateController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateController)
);

export = blueprintsRouter;
