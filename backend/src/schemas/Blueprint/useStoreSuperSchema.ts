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

const { workspaceIdSchema } = baseWorkspaceSchemas;

const { getAddEditBodySchema } = baseBlueprintSchemas;

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  ({ request }: SuperCommonParam) => {
    const {
      query: { workspaceId },
    } = request;

    return {
      query: useQuerySchema(),
      body: useBodySchema(<string>workspaceId),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => workspaceIdSchema;
}

function useBodySchema(workspaceId?: string): SchemaProvider {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  return () => getAddEditBodySchema(blueprintRepository, workspaceId);
}
