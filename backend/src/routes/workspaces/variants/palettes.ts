import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { GetAllController } from "@controllers/Palette/GetAllController";
import { useGetAllSuperSchema } from "@schemas/Palette/useGetAllSuperSchema";

const palettesRouter = Router({ mergeParams: true });

palettesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

export = palettesRouter;
