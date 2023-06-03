import { Router } from "express";

import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { StoreController } from "@controllers/File/StoreController";
import { GetAllController } from "@controllers/File/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { useStoreSuperSchema } from "@schemas/File/useStoreSuperSchema";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";

const fileRoutes = Router({ mergeParams: true });

fileRoutes.use(requireAuthentication);

fileRoutes.post(
  "/v1",
  requirePermissions([Permission.UploadFiles]),
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

fileRoutes.patch(
  "/:fileId/v1/relative-path",
  requirePermissions([Permission.UpdateFileRelativePath]),
  validateRequestWith(usePatchRelativePathSuperSchema),
  processRequestWith(PatchRelativePathController)
);

fileRoutes.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = fileRoutes;
