import { SuperSchemaRunner } from "@utils/types";
import { paginationSchemaProvider } from "@schemas/common/paginationSchemaProvider";

const getAllRolesSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    query: paginationSchemaProvider,
  };
};

export const getAllSchema = (() => {
  return getAllRolesSuperSchemaRunner;
})();
