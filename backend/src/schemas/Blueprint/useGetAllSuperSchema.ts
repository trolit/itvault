import { number, object } from "yup";
import { SuperSchemaRunner } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Blueprint/GetAllController";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";

import { paginationSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema = paginationSchema.required().concat(
  object({
    workspaceId: number()
      .required()
      .integer()
      .isEntityAvailable<Workspace>(Di.WorkspaceRepository, value => ({
        id: value,
      })),
  })
);

export const useGetAllSuperSchema: SuperSchemaRunner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
