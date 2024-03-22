import uniq from "lodash/uniq";
import sanitizeHtml from "sanitize-html";
import { array, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { Di } from "@enums/Di";
import { WORKSPACE_RULES } from "@shared/constants/rules";
import { IAddEditWorkspaceDTO } from "@shared/types/DTOs/Workspace";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const { NAME, DESCRIPTION, TAGS } = WORKSPACE_RULES;

export const useAddEditBodySchema: (
  id?: number
) => SuperSchema.Fragment<IAddEditWorkspaceDTO> = (id?: number) =>
  object({
    name: string()
      .trim()
      .required()
      .matches(NAME.REGEX)
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
            message: setYupError(CUSTOM_MESSAGES.GENERAL.UNIQUE, "Name"),
          });
        }

        return true;
      }),

    description: string()
      .trim()
      .defined()
      .transform(value => sanitizeHtml(value))
      .max(DESCRIPTION.MAX_LENGTH),

    tags: array()
      .of(string().matches(TAGS.REGEX).required())
      .required()
      .min(TAGS.MIN_LENGTH)
      .transform(value => uniq(value)),
  });
