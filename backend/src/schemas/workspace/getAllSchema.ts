import { SuperSchemaRunner } from "@utils/types";
import { paginationSchemaProvider } from "@schemas/common/paginationSchemaProvider";

const getAllUWorkspacesSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    query: paginationSchemaProvider,
  };
};

export const getAllSchema = (() => {
  return getAllUWorkspacesSuperSchemaRunner;
})();
