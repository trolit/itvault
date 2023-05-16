import { SuperSchemaRunner } from "@utils/types";
import { paginationSchema } from "@schemas/common/paginationSchema";

const getAllWorkspacesSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    query: () => paginationSchema,
  };
};

export const getAllSchema = (() => {
  return getAllWorkspacesSuperSchemaRunner;
})();
