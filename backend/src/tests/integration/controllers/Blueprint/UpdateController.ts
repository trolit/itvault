import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";
import {
  BLUEPRINT_1,
  WORKSPACE_1,
  HEAD_ADMIN_EMAIL,
  UNEXISTING_BLUEPRINT_ID,
} from "@integration-tests/config";

import { includeCommonTests } from "./includeCommonTests";
import { includeAddUpdateSchemaTests } from "./includeAddUpdateSchemaTests";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

export const UPDATE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.PUT,
    baseQuery,
  },

  ({ addTest }) => {
    includeCommonTests({
      addTest,
      baseQuery: workspaceQuery,
      blueprintId: BLUEPRINT_1.id,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when blueprint does not exist`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      appendToAction: `${UNEXISTING_BLUEPRINT_ID}`,
      query: workspaceQuery,
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    includeAddUpdateSchemaTests({
      addTest,
      baseQuery: workspaceQuery,
      blueprintId: BLUEPRINT_1.id,
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when blueprint is updated`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      appendToAction: `${BLUEPRINT_1.id}`,
      query: workspaceQuery,
      body: {
        name: BLUEPRINT_1.name,
        description: BLUEPRINT_1.description,
        color: "#FF1493",
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
        callback: async () => {
          const blueprintRepository = getInstanceOf<IBlueprintRepository>(
            Di.BlueprintRepository
          );

          const blueprint = await blueprintRepository.getById(BLUEPRINT_1.id);

          expect(blueprint?.color).to.equal("#FF1493");
        },
      },
    });
  }
);
