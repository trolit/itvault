import { Not } from "typeorm";
import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { Di } from "@enums/Di";
import { BLUEPRINT_RULES } from "@shared/constants/rules";
import { IAddEditBlueprintDto } from "@shared/types/dtos/Blueprint";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const { DESCRIPTION, COLOR } = BLUEPRINT_RULES;

export const useAddEditBodySchema: (
  workspaceId: number,
  id?: number
) => SuperSchema.Fragment<IAddEditBlueprintDto> = (
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
      .test(
        "is-name-unique",
        setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "name"),
        async value => {
          const blueprint = await blueprintRepository.getOne({
            where: {
              id: idQuery,
              name: value,
              workspace: {
                id: workspaceId,
              },
            },
          });

          return blueprint === null;
        }
      ),

    description: string().required().min(DESCRIPTION.MIN_LENGTH),

    color: string()
      .required()
      .matches(COLOR.REGEX, {
        message: setYupError(
          CUSTOM_MESSAGES.GENERAL.HEXADECIMAL_FORMAT,
          "Color"
        ),
      })
      .test(
        "is-color-unique",
        setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "color"),
        async value => {
          const blueprint = await blueprintRepository.getOne({
            where: {
              id: idQuery,
              color: value,
              workspace: {
                id: workspaceId,
              },
            },
          });

          return blueprint === null;
        }
      ),
  });
};
