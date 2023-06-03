import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

const blueprintRoutes = Router({ mergeParams: true });

blueprintRoutes.use(requireAuthentication);
blueprintRoutes.use(requireWorkspaceAccess);

blueprintRoutes.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
