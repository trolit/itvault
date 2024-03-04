import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { WORKSPACE_1, HEAD_ADMIN_EMAIL } from "@integration-tests/config";

import { includeCommonTests } from "./includeCommonTests";
import { includeSchemaTests } from "./includeSchemaTests";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

export const ADD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
  },

  ({ addTest }) => {
    includeCommonTests({ addTest, baseQuery: workspaceQuery });

    const { validBody } = includeSchemaTests({
      addTest,
      baseQuery: workspaceQuery,
    });

    addTest({
      description: `returns ${HTTP.CREATED} when blueprint is created`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body: validBody,
      expect: {
        statusCode: HTTP.CREATED,
      },
    });
  }
);
