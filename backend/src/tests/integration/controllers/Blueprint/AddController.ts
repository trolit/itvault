import { faker } from "@faker-js/faker";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import {
  BLUEPRINT_1,
  HEAD_ADMIN_EMAIL,
  MEMBER_EMAIL,
  WORKSPACE_1,
} from "@integration-tests/config";

import { BLUEPRINT_RULES } from "@shared/constants/rules";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

const body = {
  name: "unique-blueprint1",
  description: faker.random.alpha({
    count: BLUEPRINT_RULES.DESCRIPTION.MIN_LENGTH,
  }),
  color: "#471471",
};

export const ADD_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.POST,
    baseQuery,
  },

  ({ addTest }) => {
    addTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addTest({
      description: `returns ${HTTP.FORBIDDEN} when 'workspaceId' query param is not provided`,
      session: { user: { email: MEMBER_EMAIL } },
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when workspace does not exist`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: {
        ...baseQuery,
        workspaceId: 1999,
      },
      body: {},
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when name is not unique`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body: {
        ...body,
        name: BLUEPRINT_1.name,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when description is not valid`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body: {
        ...body,
        description: "A",
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when color is not in hexadecimal format`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body: {
        ...body,
        color: "(71,20,113)",
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when color is not unique`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body: {
        ...body,
        color: BLUEPRINT_1.color,
      },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.CREATED} when blueprint is created`,
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      query: workspaceQuery,
      body,
      expect: {
        statusCode: HTTP.CREATED,
      },
    });
  }
);
