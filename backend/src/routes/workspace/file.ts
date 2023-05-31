import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { StoreController } from "@controllers/File/StoreController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { patchRelativePathSchema } from "@schemas/File/patchRelativePathSchema";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.post("/v1", processRequestWith(StoreController));

fileRoutes.patch(
  "/:fileId/v1/relative-path",
  validateRequestWith(patchRelativePathSchema),
  processRequestWith(PatchRelativePathController)
);

export = fileRoutes;
