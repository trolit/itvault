import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useGetAllSuperSchema } from "@schemas/Tag/useGetAllSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { GetAllController } from "@controllers/Tag/GetAllController";

const tagsRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

tagsRouter.use(requireAuthentication);

tagsRouter.get(
  "",
  validateRequestWith({ [v1]: useGetAllSuperSchema }),
  processRequestWith(GetAllController)
);

export = tagsRouter;
