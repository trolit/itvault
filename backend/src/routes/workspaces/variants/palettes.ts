import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { StoreController } from "@controllers/Palette/StoreController";
import { GetAllController } from "@controllers/Palette/GetAllController";
import { useStoreSuperSchema } from "@schemas/Palette/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Palette/useGetAllSuperSchema";

const palettesRouter = Router({ mergeParams: true });

palettesRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

palettesRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

export = palettesRouter;
