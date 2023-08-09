import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/File/GetAllController";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const requireOneOfError = setYupError(
  CUSTOM_MESSAGES.GENERAL.REQUIRE_ONE_OF,
  "blueprintId",
  "relativePath"
);

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object().shape(
    {
      page: pageSchema,

      perPage: perPageSchema,

      blueprintId: number()
        .optional()
        .when("relativePath", {
          is: (value: string) => !!value,
          then: schema => schema.typeError(requireOneOfError),
          otherwise: schema => schema.required(),
        }),

      relativePath: string()
        .optional()
        .when("blueprintId", {
          is: (value: string) => !!value,
          then: schema => schema.typeError(requireOneOfError),
          otherwise: schema => schema.required(),
        }),

      workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
    },
    [["blueprintId", "relativePath"]]
  );

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
