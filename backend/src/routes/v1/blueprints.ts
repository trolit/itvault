import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useStoreSuperSchema } from "@schemas/Blueprint/useStoreSuperSchema";
import { useUpdateSuperSchema } from "@schemas/Blueprint/useUpdateSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

import { StoreController } from "@controllers/Blueprint/StoreController";
import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { UpdateController } from "@controllers/Blueprint/UpdateController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintsRouter = Router();

blueprintsRouter.use(requireWorkspaceAccess);

blueprintsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
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

blueprintsRouter.patch(
  "/:id",
  validateRequestWith(useUpdateSuperSchema, {
    versions: UpdateController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateController)
);

export = blueprintsRouter;
