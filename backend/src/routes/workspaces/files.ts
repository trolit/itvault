import { Router } from "express";

import { FILES } from "@config";
import { Permission } from "@enums/Permission";
import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { StoreController } from "@controllers/File/StoreController";
import { GetAllController } from "@controllers/File/GetAllController";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { useStoreSuperSchema } from "@schemas/File/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
import { parseWorkspaceFormData } from "@middleware/parseWorkspaceFormData";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";

const filesRouter = Router({ mergeParams: true });

filesRouter.use(requireWorkspaceAccess);

filesRouter.post(
  "/v1",
  requirePermissions([Permission.UploadFiles]),
  parseWorkspaceFormData({
    multiples: true,
    basePath: FILES.STORAGE.BASE_TEMPORARY_UPLOADS_PATH,
  }),
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

filesRouter.patch(
  "/:fileId/v1/relative-path",
  requirePermissions([Permission.UpdateFileRelativePath]),
  validateRequestWith(usePatchRelativePathSuperSchema),
  processRequestWith(PatchRelativePathController)
);

filesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = filesRouter;
