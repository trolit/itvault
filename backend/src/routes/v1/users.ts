import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/User/useStoreSuperSchema";
import { useSignUpSuperSchema } from "@schemas/User/useSignUpSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";
import { useGetAllNotesByIdSuperSchema } from "@schemas/User/useGetAllNotesByIdSuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/User/StoreController";
import { GetAllController } from "@controllers/User/GetAllController";
import { SignUpController } from "@controllers/User/SignUpController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";
import { GetAllNotesByIdController } from "@controllers/User/GetAllNotesByIdController";

const usersRouter = Router();

const {
  ALL_VERSION_DEFINITIONS: { v1_0 },
} = BaseController;

usersRouter.get(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith({ [v1_0]: useGetAllSuperSchema }),
  transformPagination(),
  processRequestWith(GetAllController)
);

usersRouter.get(
  "/:id/notes",
  validateRequestWith({ [v1_0]: useGetAllNotesByIdSuperSchema }),
  transformPagination({ perPage: GetAllNotesByIdController.ITEMS_PER_PAGE }),
  processRequestWith(GetAllNotesByIdController)
);

usersRouter.post(
  "",
  requireAuthentication,
  requirePermissions([Permission.CreateUser]),
  validateRequestWith({ [v1_0]: useStoreSuperSchema }),
  processRequestWith(StoreController)
);

usersRouter.post(
  "/sign-up",
  validateRequestWith({ [v1_0]: useSignUpSuperSchema }),
  processRequestWith(SignUpController)
);

usersRouter.patch(
  "",
  requireAuthentication,
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith({ [v1_0]: useUpdateManySuperSchema }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
