import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { StoreController } from "@controllers/Blueprint/StoreController";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

const blueprintsRouter = Router({ mergeParams: true });

blueprintsRouter.use(requireWorkspaceAccess);

blueprintsRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

blueprintsRouter.post("/v1", processRequestWith(StoreController));

export = blueprintsRouter;
