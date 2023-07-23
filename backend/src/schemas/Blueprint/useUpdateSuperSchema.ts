import {
  SchemaProvider,
  SuperCommonParam,
  SuperSchemaRunner,
} from "super-schema-types";

import { baseBlueprintSchemas } from "./baseSchemas";

import { Di } from "@enums/Di";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { getIsEntityAvailableSchema } from "@schemas/common/getIsEntityAvailableSchema";

import { IParams, IQuery } from "@controllers/Blueprint/UpdateController";

const { getIsWorkspaceAvailableSchema } = baseWorkspaceSchemas;

const { getAddEditBodySchema } = baseBlueprintSchemas;

export const useUpdateSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  ({ request }: SuperCommonParam<IParams, AddEditBlueprintDto, IQuery>) => {
    const {
      params: { id },
      query: { workspaceId },
    } = request;

    return {
      query: useQuerySchema(),
      params: useParamsSchema(),
      body: useBodySchema(id, workspaceId),
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

function useBodySchema(id: number, workspaceId: number): SchemaProvider {
  const blueprintRepository = getInstanceOf<IBlueprintRepository>(
    Di.BlueprintRepository
  );

  return () => getAddEditBodySchema(blueprintRepository, workspaceId, id);
}
