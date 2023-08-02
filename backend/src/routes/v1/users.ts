import { Router } from "express";

import { Permission } from "@enums/Permission";

import { processRequestWith } from "@helpers/processRequestWith";
import { requirePermissions } from "@middleware/requirePermissions";
import { transformPagination } from "@middleware/transformPagination";
import { validateRequestWith } from "@middleware/validateRequestWith";
import { requireAuthentication } from "@middleware/requireAuthentication";

import { useStoreSuperSchema } from "@schemas/User/useStoreSuperSchema";
import { useGetAllSuperSchema } from "@schemas/User/useGetAllSuperSchema";
import { useSignUpSuperSchema } from "@schemas/User/useSignUpSuperSchema";
import { useUpdateManySuperSchema } from "@schemas/User/useUpdateManySuperSchema";
import { useGetNotesByIdSuperSchema } from "@schemas/User/useGetNotesByIdSuperSchema";

import { StoreController } from "@controllers/User/StoreController";
import { GetAllController } from "@controllers/User/GetAllController";
import { SignUpController } from "@controllers/User/SignUpController";
import { UpdateManyController } from "@controllers/User/UpdateManyController";
import { GetNotesByIdController } from "@controllers/User/GetNotesByIdController";

const usersRouter = Router();

usersRouter.get(
  "",
  requireAuthentication,
  requirePermissions([Permission.ViewAllUsers]),
  validateRequestWith(useGetAllSuperSchema, {
    versions: GetAllController.ALL_VERSIONS,
  }),
  transformPagination,
  processRequestWith(GetAllController)
);

usersRouter.get(
  "/:id/notes",
  validateRequestWith(useGetNotesByIdSuperSchema, {
    versions: GetNotesByIdController.ALL_VERSIONS,
  }),
  processRequestWith(GetNotesByIdController)
);

usersRouter.post(
  "",
  requireAuthentication,
  requirePermissions([Permission.CreateUser]),
  validateRequestWith(useStoreSuperSchema, {
    versions: StoreController.ALL_VERSIONS,
  }),
  processRequestWith(StoreController)
);

usersRouter.post(
  "/sign-up",
  validateRequestWith(useSignUpSuperSchema, {
    versions: SignUpController.ALL_VERSIONS,
  }),
  processRequestWith(SignUpController)
);

usersRouter.patch(
  "",
  requireAuthentication,
  requirePermissions(UpdateManyController.isMissingPermissions),
  validateRequestWith(useUpdateManySuperSchema, {
    versions: UpdateManyController.ALL_VERSIONS,
  }),
  processRequestWith(UpdateManyController)
);

export = usersRouter;
