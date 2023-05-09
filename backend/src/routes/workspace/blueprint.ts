import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllController } from "@controllers/Blueprint/GetAllController";

const blueprintRoutes = Router();

blueprintRoutes.get(
  "/v1",
  requireAuthentication,
  processRequestWith(GetAllController)
);

export = blueprintRoutes;
