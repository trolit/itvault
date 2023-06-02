import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { StoreController } from "@controllers/File/StoreController";
import { GetAllController } from "@controllers/File/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { useStoreSuperSchema } from "@schemas/File/useStoreSuperSchema";
import { requireAuthentication } from "@middleware/requireAuthentication"; // @TODO (use)
import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
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

fileRoutes.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = fileRoutes;
