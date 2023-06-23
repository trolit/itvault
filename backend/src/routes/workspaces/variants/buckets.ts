import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Bucket/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";

import { StoreController } from "@controllers/Bucket/StoreController";
import { GetAllController } from "@controllers/Bucket/GetAllController";

const bucketsRouter = Router({ mergeParams: true });

bucketsRouter.get(
  "/v1",
  validateRequestWith(useGetAllSuperSchema),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "/v1",
  validateRequestWith(useStoreSuperSchema),
  processRequestWith(StoreController)
);

export = bucketsRouter;
