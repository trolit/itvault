import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { StoreController } from "@controllers/File/StoreController";
import { requireAuthentication } from "@middleware/requireAuthentication";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.post(
  "/v1",
  // requireAuthentication,
  processRequestWith(StoreController)
);

export = fileRoutes;
