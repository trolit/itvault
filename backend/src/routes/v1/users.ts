import { Router } from "express";

import { Permission } from "@shared/types/enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/User/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useSignUpSuperSchema } from "@schemas/User/useSignUpSuperSchema";
import { useGetNotesSuperSchema } from "@schemas/User/useGetNotesSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";

import { BaseController } from "@controllers/BaseController";
import { StoreController } from "@controllers/User/StoreController";
import { SignUpController } from "@controllers/User/SignUpController";
import { GetAllController } from "@controllers/User/GetAllController";
import { GetNotesController } from "@controllers/User/GetNotesController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";

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
  validateRequestWith({ [v1_0]: useGetNotesSuperSchema }),
  transformPagination({ defaultPerPage: GetNotesController.ITEMS_PER_PAGE }),
  processRequestWith(GetNotesController)
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
