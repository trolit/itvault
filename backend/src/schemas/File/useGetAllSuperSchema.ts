import { number, object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/File/GetAllController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<GetAllControllerTypes.v1.QueryInput> =
  object().shape(
    {
      page: pageSchema,

      perPage: perPageSchema,

      blueprintId: number()
        .optional()
        .when("relativePath", {
          is: (value: string) => !!value,
          then: schema =>
            schema.typeError(
              "Either blueprintId or relativePath should be provided."
            ),
          otherwise: schema => schema.required(),
        }),

      relativePath: string()
        .optional()
        .when("blueprintId", {
          is: (value: string) => !!value,
          then: schema =>
            schema.typeError(
              "Either blueprintId or relativePath should be provided."
            ),
          otherwise: schema => schema.required(),
        }),

      workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
    },
    [["blueprintId", "relativePath"]]
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
