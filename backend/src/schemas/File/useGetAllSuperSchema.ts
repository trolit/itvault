import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/File/GetAllController";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const requireOneOfError = setYupError(
  CUSTOM_MESSAGES.GENERAL.REQUIRE_ONE_OF,
  "blueprintId",
  "relativePath"
);

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.Query> =
  object().shape(
    {
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
          // @TODO include relativePath test
          otherwise: schema => schema.required(),
        }),

      workspaceId: number().required(),
    },
    [["blueprintId", "relativePath"]]
  );

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
