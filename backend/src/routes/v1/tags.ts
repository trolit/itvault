import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";

import { useGetAllSuperSchema } from "@schemas/Tag/useGetAllSuperSchema";

import { GetAllController } from "@controllers/Tag/GetAllController";

const tagsRouter = Router();

tagsRouter.get(
  "",
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  processRequestWith(GetAllController)
);

export = tagsRouter;
