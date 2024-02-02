import { Variant } from "@db/entities/Variant";
import { SuperSchema } from "types/SuperSchema";
import { Blueprint } from "@db/entities/Blueprint";
import { array, lazy, number, object, string } from "yup";
import { UpsertControllerTypes } from "types/controllers/Bucket/UpsertController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

// @NOTE - workspace availability is checked within `requireWorkspaceAccess` middleware!!
const querySchema: SuperSchema.Fragment<UpsertControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const useBodySchema: (
  workspaceId: number
) => SuperSchema.Fragment<UpsertControllerTypes.v1.Body> = (
  workspaceId: number
) =>
  object({
    value: lazy(data => {
      let schema = {};

      Object.keys(data).map(key => {
        schema = { ...schema, [key]: array().of(string()).min(1) };
      });

      return object(schema).required();
    }),

    variantId: useIdStringSchema<Variant>(Di.VariantRepository, {
      file: { workspace: { id: workspaceId } },
    }),

    blueprintId: useIdNumberSchema<Blueprint>(Di.BlueprintRepository, {
      workspace: { id: workspaceId },
    }),
  });

export const useUpsertSuperSchema: SuperSchema.Runner<
  void,
  UpsertControllerTypes.v1.Body,
  UpsertControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    body: useBodySchema(workspaceId),
  };
});
