import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Bucket/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";

import { StoreController } from "@controllers/Bucket/StoreController";
import { GetAllController } from "@controllers/Bucket/GetAllController";

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
