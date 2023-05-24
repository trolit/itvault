import { Router } from "express";

import { storeSchema } from "@schemas/File/storeSchema";
import { processRequestWith } from "@helpers/processRequestWith";
import { StoreController } from "@controllers/File/StoreController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.post(
  "/v1",
  validateRequestWith(storeSchema),
  processRequestWith(StoreController)
);

export = fileRoutes;
