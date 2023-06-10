// @TMP @TMP @TMP (will be handled in next 'patch' PR)
// @TODO - this should go under workspaces/:w-id/files/:f-id/variants/:v-id

import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { GetByIdController } from "@controllers/Variant/GetByIdController";

const variantRoutes = Router({ mergeParams: true });

// variantRoutes.use(requireAuthentication);
// variantRoutes.use(requireWorkspaceAccess);

variantRoutes.get("/:variantId/v1", processRequestWith(GetByIdController));

export = variantRoutes;
