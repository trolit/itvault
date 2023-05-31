import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";
import { useGetAllSuperSchema } from "@schemas/Blueprint/useGetAllSuperSchema";

const blueprintRoutes = Router({ mergeParams: true });

blueprintRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
