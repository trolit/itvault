import { Not } from "typeorm";
import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { Di } from "@enums/Di";
import { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useAddEditBodySchema: (
  workspaceId: number,
  id?: number
) => SuperSchemaElement<AddEditBlueprintDto> = (
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

    description: string().required().min(10),

    color: string()
      .required()
      .matches(/^#[a-zA-Z0-9]{6}$/, {
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
              name: value,
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
