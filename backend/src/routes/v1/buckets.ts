import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useStoreSuperSchema } from "@schemas/Bucket/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";

import { StoreController } from "@controllers/Bucket/StoreController";
import { GetAllController } from "@controllers/Bucket/GetAllController";

const bucketsRouter = Router({ mergeParams: true });

bucketsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

bucketsRouter.post(
  "",
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

export = bucketsRouter;
