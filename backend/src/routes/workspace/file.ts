import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { StoreController } from "@controllers/File/StoreController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { useStoreSuperSchema } from "@schemas/File/useStoreSuperSchema";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { GetAllRootController } from "@controllers/File/GetAllRootController";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

fileRoutes.patch(
  "/:fileId/v1/relative-path",
  validateRequestWith(usePatchRelativePathSuperSchema),
  processRequestWith(PatchRelativePathController)
);

fileRoutes.get("/v1/root", processRequestWith(GetAllRootController));

export = fileRoutes;
