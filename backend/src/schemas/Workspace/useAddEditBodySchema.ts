import uniq from "lodash/uniq";
import sanitizeHtml from "sanitize-html";
import { array, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { Di } from "@enums/Di";
import { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useAddEditBodySchema: (
  id?: number
) => SuperSchema.Fragment<AddEditWorkspaceDto> = (id?: number) =>
  object({
    name: string()
      .trim()
      .required()
      .matches(/^[a-zA-Z0-9- ]*$/)
      .test(async (value, ctx) => {
        const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
          Di.WorkspaceRepository
        );

        const workspace = await workspaceRepository.getOne({
          where: { id: id || undefined, name: value },
        });

        if (id && workspace) {
          return true;
        }

        if (workspace) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.ALREADY_TAKEN, "name"),
          });
        }

        return true;
      }),

    description: string()
      .trim()
      .required()
      .transform(value => sanitizeHtml(value))
      .max(255),

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
