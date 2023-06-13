import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { GetAllController } from "@controllers/Palette/GetAllController";
import { requireWorkspaceAccess } from "@middleware/requireWorkspaceAccess";
import { useGetAllSuperSchema } from "@schemas/Palette/useGetAllSuperSchema";

const palettesRouter = Router({ mergeParams: true });

palettesRouter.use(requireWorkspaceAccess);

palettesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = palettesRouter;
