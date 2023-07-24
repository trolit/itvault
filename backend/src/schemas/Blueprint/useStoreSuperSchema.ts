import { SchemaProvider, SuperSchemaRunner } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Blueprint/StoreController";

import { baseBlueprintSchemas } from "./baseSchemas";

import { Di } from "@enums/Di";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { workspaceIdSchema } = baseWorkspaceSchemas;

const { getAddEditBodySchema } = baseBlueprintSchemas;

export const useStoreSuperSchema: SuperSchemaRunner<StoreControllerTypes.v1.Request> =
  defineSuperSchemaRunner(({ request }) => {
    const {
      query: { workspaceId },
    } = request;

    return {
      query: useQuerySchema(),
      // @NOTE keep body below to validate query first!
      body: useBodySchema(workspaceId),
    };
  });

function useQuerySchema(): SchemaProvider {
  return () => workspaceIdSchema;
}

function useBodySchema(workspaceId: number): SchemaProvider {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  return () => getAddEditBodySchema(blueprintRepository, workspaceId);
}
