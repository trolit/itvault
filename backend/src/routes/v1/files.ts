import { Router } from "express";

import { FILES } from "@config";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
import { useSoftDeleteSuperSchema } from "@schemas/File/useSoftDeleteSuperSchema";
import { usePatchFilenameSuperSchema } from "@schemas/File/usePatchFilenameSuperSchema";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";

import { StoreController } from "@controllers/File/StoreController";
import { GetAllController } from "@controllers/File/GetAllController";
import { SoftDeleteController } from "@controllers/File/SoftDeleteController";
import { PatchFilenameController } from "@controllers/File/PatchFilenameController";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";

const filesRouter = Router();

filesRouter.use(requireWorkspaceAccess);

filesRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

filesRouter.post(
  "",
  requirePermissions([Permission.UploadFiles]),
  requireEndpointVersion(StoreController.ALL_VERSIONS),
  IsWorkspaceAvailable,
  parseUploadFormData({
    multiples: true,
    basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
  }),
  processRequestWith(StoreController)
);

filesRouter.patch(
  "/:id/relative-path",
  requirePermissions([Permission.UpdateFileRelativePath]),
  validateRequestWith(usePatchRelativePathSuperSchema, {
    versions: PatchRelativePathController.ALL_VERSIONS,
  }),
  processRequestWith(PatchRelativePathController)
);

filesRouter.patch(
  "/:id/filename",
  requirePermissions([Permission.UpdateFilename]),
  validateRequestWith(usePatchFilenameSuperSchema, {
    versions: PatchFilenameController.ALL_VERSIONS,
  }),
  processRequestWith(PatchFilenameController)
);

filesRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteFile]),
  validateRequestWith(useSoftDeleteSuperSchema, {
    versions: SoftDeleteController.ALL_VERSIONS,
  }),
  processRequestWith(SoftDeleteController)
);

export = filesRouter;
