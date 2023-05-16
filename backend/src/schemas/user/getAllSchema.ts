import { SuperSchemaRunner } from "@utils/types";
import { paginationSchema } from "@schemas/common/paginationSchema";

const getAllUsersSuperSchemaRunner: SuperSchemaRunner = () => {
  return {
    query: () => paginationSchema,
  };
};

export const getAllSchema = (() => {
  return getAllUsersSuperSchemaRunner;
})();
