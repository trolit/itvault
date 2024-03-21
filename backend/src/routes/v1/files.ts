import { Router } from "express";
import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FILES } from "@config";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { parseUploadFormData } from "@middleware/parseUploadFormData";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { IsWorkspaceAvailable } from "@middleware/isWorkspaceAvailable";
import { requireAuthentication } from "@middleware/requireAuthentication";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { requireEndpointVersion } from "@middleware/requireEndpointVersion";

import { useGetAllSuperSchema } from "@schemas/File/useGetAllSuperSchema";
import { usePatchFilenameSuperSchema } from "@schemas/File/usePatchFilenameSuperSchema";
import { usePatchRelativePathSuperSchema } from "@schemas/File/usePatchRelativePathSuperSchema";
import { useDeleteWithIntegerSuperSchema } from "@schemas/common/useDeleteWithIntegerSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { UploadController } from "@controllers/File/UploadController";
import { GetAllController } from "@controllers/File/GetAllController";
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
filesRouter.use(IsWorkspaceAvailable);

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
  validateRequestWith({ [v1]: useDeleteWithIntegerSuperSchema }),
  processRequestWith(SoftDeleteController)
);

export = filesRouter;
