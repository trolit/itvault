import { Router } from "express";

import { processRequestWith } from "@helpers/processRequestWith";

import { GetAllController } from "@controllers/Tag/GetAllController";

const tagsRouter = Router();

tagsRouter.get("", processRequestWith(GetAllController));

export = tagsRouter;
