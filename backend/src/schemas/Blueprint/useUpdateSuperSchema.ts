import {
  SchemaProvider,
  SuperCommonParam,
  SuperSchemaRunner,
} from "super-schema-types";

import { baseBlueprintSchemas } from "./baseSchemas";

import { Di } from "@enums/Di";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { getIsEntityAvailableSchema } from "@schemas/common/getIsEntityAvailableSchema";

const { getIsWorkspaceAvailableSchema } = baseWorkspaceSchemas;
const { getAddEditBodySchema } = baseBlueprintSchemas;

export const useUpdateSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  ({ request }: SuperCommonParam) => {
    const {
      query: { workspaceId },
    } = request;

    return {
      query: useQuerySchema(),
      params: useParamsSchema(),
      body: useBodySchema(<string>workspaceId),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => getIsWorkspaceAvailableSchema("workspaceId");
}

function useParamsSchema(): SchemaProvider {
  return () =>
    getIsEntityAvailableSchema("id", Di.BlueprintRepository, "Blueprint");
}

function useBodySchema(workspaceId?: string): SchemaProvider {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  const parsedWorkspaceId = workspaceId ? parseInt(workspaceId) : null;

  if (!parsedWorkspaceId) {
    return () => null;
  }

  return () => getAddEditBodySchema(blueprintRepository, parsedWorkspaceId);
}
