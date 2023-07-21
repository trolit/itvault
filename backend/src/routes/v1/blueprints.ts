import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useStoreSuperSchema } from "@schemas/Blueprint/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

import { SoftDeleteController } from "@controllers/SoftDeleteController";
import { StoreController } from "@controllers/Blueprint/StoreController";
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

export = blueprintsRouter;
