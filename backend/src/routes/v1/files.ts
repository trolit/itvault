import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FILES } from "@config";

import { Permission } from "@shared/types/enums/Permission";

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

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/File/StoreController";
import { GetAllController } from "@controllers/File/GetAllController";
import { SoftDeleteController } from "@controllers/File/SoftDeleteController";
import { PatchFilenameController } from "@controllers/File/PatchFilenameController";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";

const filesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

filesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);

filesRouter.get(
  "",
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
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
  validateRequestWith({ [v1_0]: usePatchRelativePathSuperSchema }),
  processRequestWith(PatchRelativePathController)
);

filesRouter.patch(
  "/:id/filename",
  requirePermissions([Permission.UpdateFilename]),
  validateRequestWith({ [v1_0]: usePatchFilenameSuperSchema }),
  processRequestWith(PatchFilenameController)
);

filesRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteFile]),
  validateRequestWith({ [v1_0]: useSoftDeleteSuperSchema }),
  processRequestWith(SoftDeleteController)
);

export = filesRouter;
