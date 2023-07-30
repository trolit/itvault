import { Not } from "typeorm";
import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

import { Di } from "@enums/Di";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

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
        () => `This name is not available.`,
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
        message: "Color needs to be in hexadecimal pattern.",
      })
      .test(
        "is-color-unique",
        () => `This color is not available.`,
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
