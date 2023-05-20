import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { StoreController } from "@controllers/File/StoreController";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.post(
  "/v1",
  // requireAuthentication,
  processRequestWith(StoreController)
);

export = fileRoutes;
