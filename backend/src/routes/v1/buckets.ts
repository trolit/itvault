import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useGetAllSuperSchema } from "@schemas/Bucket/useGetAllSuperSchema";
import { useStoreManySuperSchema } from "@schemas/Bucket/useStoreManySuperSchema";

import { GetAllController } from "@controllers/Bucket/GetAllController";
import { StoreManyController } from "@controllers/Bucket/StoreManyController";

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
  validateRequestWith(useStoreManySuperSchema, {
    versions: StoreManyController.ALL_VERSIONS,
  }),
  processRequestWith(StoreManyController)
);

export = bucketsRouter;
