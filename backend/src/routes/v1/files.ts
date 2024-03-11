import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FILES } from "@config";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
import { useSoftDeleteSuperSchema } from "@schemas/File/useSoftDeleteSuperSchema";
import { usePatchFilenameSuperSchema } from "@schemas/File/usePatchFilenameSuperSchema";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/File/GetAllController";
import { UploadController } from "@controllers/File/UploadController";
import { GetByIdController } from "@controllers/File/GetByIdController";
import { SoftDeleteController } from "@controllers/File/SoftDeleteController";
import { PatchFilenameController } from "@controllers/File/PatchFilenameController";
import { PatchRelativePathController } from "@controllers/File/PatchRelativePathController";

const filesRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

filesRouter.use(requireAuthentication);
filesRouter.use(
  requireWorkspaceAccess<WorkspaceId>(({ query }) => query.workspaceId)
);

filesRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

filesRouter.get(
  "/:id",
  requireEndpointVersion(GetByIdController.ALL_VERSIONS),
  processRequestWith(GetByIdController)
);

filesRouter.post(
  "",
  requirePermissions([Permission.UploadFiles]),
  requireEndpointVersion(UploadController.ALL_VERSIONS),
  IsWorkspaceAvailable,
  parseUploadFormData({
    multiples: true,
    basePath: FILES.BASE_TEMPORARY_UPLOADS_PATH,
  }),
  processRequestWith(UploadController)
);

filesRouter.patch(
  "/:id/relative-path",
  requirePermissions([Permission.MoveFiles]),
  validateRequestWith({ [v1]: usePatchRelativePathSuperSchema }),
  processRequestWith(PatchRelativePathController)
);

filesRouter.patch(
  "/:id/filename",
  requirePermissions([Permission.UpdateFilename]),
  validateRequestWith({ [v1]: usePatchFilenameSuperSchema }),
  processRequestWith(PatchFilenameController)
);

filesRouter.delete(
  "/:id",
  requirePermissions([Permission.DeleteFile]),
  validateRequestWith({ [v1]: useSoftDeleteSuperSchema }),
  processRequestWith(SoftDeleteController)
);

export = filesRouter;
