import { SuperSchemaRunner } from "@utils/types";
import { paginationSchema } from "@schemas/common/paginationSchema";

const getAllRolesSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    query: () => paginationSchema,
  };
};

export const getAllSchema = (() => {
  return getAllRolesSuperSchemaRunner;
})();
