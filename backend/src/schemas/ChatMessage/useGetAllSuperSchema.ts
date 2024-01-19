import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/ChatMessage/GetAllController";

import { pageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: number().required().integer().min(5).max(10),
    messageId: number().optional(),
    workspaceId: number().required(),
  });

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
