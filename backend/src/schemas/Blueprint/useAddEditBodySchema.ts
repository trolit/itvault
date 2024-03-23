import { Not } from "typeorm";
import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { Di } from "@enums/Di";
import { BLUEPRINT_RULES } from "@shared/constants/rules";
import { IAddEditBlueprintDTO } from "@shared/types/DTOs/Blueprint";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const { DESCRIPTION, COLOR } = BLUEPRINT_RULES;

export const useAddEditBodySchema: (
  workspaceId: number,
  id?: number
) => SuperSchema.Fragment<IAddEditBlueprintDTO> = (
  workspaceId: number,
  id?: number
) => {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  const idQuery = id ? Not(id) : undefined;

  return object({
    name: string()
      .required()
      .test(async (value, ctx) => {
        const blueprint = await blueprintRepository.getOne({
          where: {
            id: idQuery,
            name: value,
            workspace: {
              id: workspaceId,
            },
          },
        });

        if (blueprint) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.USER.NO_PERSONAL_ACCOUNT_CHANGES
            ),
          });
        }

        return true;
      }),

    description: string().required().min(DESCRIPTION.MIN_LENGTH),

    color: string()
      .required()
      .matches(COLOR.REGEX, {
        message: setYupError(
          CUSTOM_MESSAGES.GENERAL.HEXADECIMAL_FORMAT,
          "Color"
        ),
      })
      .test(async (value, ctx) => {
        const blueprint = await blueprintRepository.getOne({
          where: {
            id: idQuery,
            color: value,
            workspace: {
              id: workspaceId,
            },
          },
        });

        if (blueprint) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE,
              "color"
            ),
          });
        }

        return true;
      }),
  });
};
