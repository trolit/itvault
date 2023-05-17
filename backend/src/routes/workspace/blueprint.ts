import { Router } from "express";

import { getAllSchema } from "@schemas/Blueprint/getAllSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintRoutes = Router({ mergeParams: true });

blueprintRoutes.get(
  "/v1",
  requireAuthentication,
  validateRequestWith(getAllSchema),
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
