import { Router } from "express";

import { getAllSchema } from "@schemas/blueprint/getAllSchema";
import { safeParseRequest } from "@middleware/safeParseRequest";
import { processRequestWith } from "@helpers/processRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintRoutes = Router({ mergeParams: true });

blueprintRoutes.get(
  "/v1",
  requireAuthentication,
  safeParseRequest(getAllSchema),
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
