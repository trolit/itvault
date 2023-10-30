import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetTreeControllerTypes } from "types/controllers/Workspace/GetTreeController";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useRelativePathTest } from "@schemas/common/useRelativePathTest";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const requireOneOfError = setYupError(
  CUSTOM_MESSAGES.GENERAL.REQUIRE_ONE_OF,
  "blueprintId",
  "relativePath"
);

const querySchema: SuperSchema.Fragment<GetTreeControllerTypes.v1.Query> =
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
          otherwise: useRelativePathTest,
        }),
    },
    [["blueprintId", "relativePath"]]
  );

const paramsSchema: SuperSchema.Fragment<GetTreeControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetTreeSuperSchema: SuperSchema.Runner<
  GetTreeControllerTypes.v1.Params,
  void,
  GetTreeControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
