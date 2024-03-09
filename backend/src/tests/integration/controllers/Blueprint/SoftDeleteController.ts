import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { WORKSPACE_2 } from "@integration-tests/config";
import { Method, defineTests } from "@integration-tests/probata";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { includeCommonTests } from "./includeCommonTests";

import { Di } from "@enums/Di";
import { SUPER_USER_EMAIL } from "@shared/constants/tests";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_2.id };

export const BLUEPRINT_TO_DELETE = {
  id: 3,
  name: "This is blueprint3",
  color: "#336699",
  description: "Blueprint3 description is quite typical.",
  workspaceId: WORKSPACE_2.id,
};

export const SOFT_DELETE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.DELETE,
    baseQuery,
  },

  ({ addTest }) => {
    includeCommonTests({
      addTest,
      baseQuery: workspaceQuery,
      blueprintId: BLUEPRINT_TO_DELETE.id,
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} when blueprint is deleted`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: `${BLUEPRINT_TO_DELETE.id}`,
      query: workspaceQuery,
      expect: {
        statusCode: HTTP.NO_CONTENT,
        callback: async () => {
          const blueprintRepository = getInstanceOf<IBlueprintRepository>(
            Di.BlueprintRepository
          );

          const blueprint = await blueprintRepository.getById(
            BLUEPRINT_TO_DELETE.id
          );

          expect(blueprint).to.equal(null);
        },
      },
    });
  }
);
