import { In, Not } from "typeorm";
import { array, number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IUserRepository } from "types/repositories/IUserRepository";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";
import { UpdateWorkspacesAccessControllerTypes } from "types/controllers/User/UpdateWorkspacesAccessController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const useQuerySchema: (
  requestUserId: number
) => SuperSchema.Fragment<UpdateWorkspacesAccessControllerTypes.v1.Query> = (
  requestUserId: number
) =>
  object({
    userId: number()
      .required()
      .test(async (userId: number, ctx) => {
        if (userId === requestUserId) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.USER.NO_PERSONAL_ACCOUNT_CHANGES
            ),
          });
        }

        const userRepository = getInstanceOf<IUserRepository>(
          Di.UserRepository
        );

        const user = await userRepository.getOne({
          where: {
            id: userId,
            role: {
              id: Not(HEAD_ADMIN_ROLE_ID),
            },
          },
        });

        if (!user) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "user"),
          });
        }

        return true;
      }),
  });

const bodySchema: SuperSchema.Fragment<UpdateWorkspacesAccessControllerTypes.v1.Body> =
  object({
    ids: array()
      .of(number().required())
      .required()
      .test(async (values: number[], ctx) => {
        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const availableWorkspaces = await workspaceRepository.getAll({
          where: {
            id: In(values),
          },
        });

        if (availableWorkspaces.length !== values.length) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.USER.INVALID_WORKSPACES),
          });
        }

        return true;
      }),
  });

export const useUpdateWorkspaceAccessSuperSchema: SuperSchema.Runner<
  void,
  UpdateWorkspacesAccessControllerTypes.v1.Body,
  UpdateWorkspacesAccessControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  return {
    body: bodySchema,
    query: useQuerySchema(request.userId),
  };
});
