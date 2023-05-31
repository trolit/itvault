import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { getAllSuperSchema } from "@schemas/Blueprint/getAllSuperSchema";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintRoutes = Router({ mergeParams: true });

blueprintRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(getAllSuperSchema),
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
