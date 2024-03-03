import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { Method, defineTests } from "@integration-tests/probata";
import {
  BLUEPRINT_1,
  WORKSPACE_1,
  MEMBER_EMAIL,
  HEAD_ADMIN_EMAIL,
} from "@integration-tests/config";

import { APP } from "@config";

import { PaginatedResponse } from "@shared/types/PaginatedResponse";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

export const GET_ALL_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
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
      description: `returns ${HTTP.FORBIDDEN} when user is not permitted to access workspace content`,
      query: { ...baseQuery, workspaceId: WORKSPACE_1.id },
      session: { user: { email: MEMBER_EMAIL } },
      expect: {
        statusCode: HTTP.FORBIDDEN,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when 'page' query param is invalid`,
      query: {
        ...baseQuery,
        perPage: APP.MAX_ITEMS_PER_PAGE,
        workspaceId: WORKSPACE_1.id,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when 'perPage' query param is invalid`,
      query: {
        ...baseQuery,
        page: 1,
        workspaceId: WORKSPACE_1.id,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.OK} with 2 items`,
      query: {
        ...baseQuery,
        page: 1,
        perPage: APP.MAX_ITEMS_PER_PAGE,
        workspaceId: WORKSPACE_1.id,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
        callback: response => {
          const { total, result } = <PaginatedResponse<BlueprintMapper>>(
            response.body
          );

          expect(total).to.equal(2);
          expect(result.length).to.equal(2);
        },
      },
    });

    addTest({
      description: `returns ${HTTP.OK} with 1 item (match by name)`,
      query: {
        ...baseQuery,
        page: 1,
        name: BLUEPRINT_1.name,
        perPage: APP.MAX_ITEMS_PER_PAGE,
        workspaceId: WORKSPACE_1.id,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
        callback: response => {
          const { total, result } = <PaginatedResponse<BlueprintMapper>>(
            response.body
          );

          expect(total).to.equal(1);
          expect(result.length).to.equal(1);
        },
      },
    });

    addTest({
      description: `returns ${HTTP.OK} with 0 items (return only used ones)`,
      query: {
        ...baseQuery,
        page: 1,
        inUse: 1,
        perPage: APP.MAX_ITEMS_PER_PAGE,
        workspaceId: WORKSPACE_1.id,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
        callback: response => {
          const { total, result } = <PaginatedResponse<BlueprintMapper>>(
            response.body
          );

          expect(total).to.equal(0);
          expect(result.length).to.equal(0);
        },
      },
    });
  }
);
