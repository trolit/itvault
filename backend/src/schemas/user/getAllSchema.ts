import { SuperSchemaRunner } from "@utils/types";
import { paginationSchemaProvider } from "@schemas/common/paginationSchemaProvider";

const getAllUsersSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    query: paginationSchemaProvider,
  };
};

export const getAllSchema = (() => {
  return getAllUsersSuperSchemaRunner;
})();
