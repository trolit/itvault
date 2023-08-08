import uniq from "lodash/uniq";
import { array, object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

import { Di } from "@enums/Di";
import { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useAddEditBodySchema: (
  id?: number
) => SuperSchemaElement<AddEditWorkspaceDto> = (id?: number) =>
  object({
    name: string()
      .required()
      .test(async (value, ctx) => {
        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const workspace = await workspaceRepository.getOne({
          where: { id: id || undefined, name: value },
        });

        if (workspace) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.ALREADY_TAKEN, "name"),
          });
        }

        return true;
      }),

    tags: array()
      .of(
        string()
          .matches(/^[a-zA-Z0-9]*$/)
          .required()
      )
      .required()
      .min(1)
      .transform(value => uniq(value)),
  });
