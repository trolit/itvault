import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { GetAllController } from "@controllers/Palette/GetAllController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";

const palettesRouter = Router({ mergeParams: true });

palettesRouter.use(requireWorkspaceAccess);

palettesRouter.get("/v1", processRequestWith(GetAllController));

export = palettesRouter;
