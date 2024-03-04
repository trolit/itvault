import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { Method, defineTests } from "@integration-tests/probata";
import {
  BLUEPRINT_1,
  WORKSPACE_1,
  HEAD_ADMIN_EMAIL,
} from "@integration-tests/config";

import { APP } from "@config";

import { includeCommonTests } from "./includeCommonTests";

import { PaginatedResponse } from "@shared/types/PaginatedResponse";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };
const workspaceQuery = { ...baseQuery, workspaceId: WORKSPACE_1.id };

export const GET_ALL_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest }) => {
    includeCommonTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when 'page' query param is invalid`,
      query: {
        ...workspaceQuery,
        perPage: APP.MAX_ITEMS_PER_PAGE,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.BAD_REQUEST} when 'perPage' query param is invalid`,
      query: {
        ...workspaceQuery,
        page: 1,
      },
      session: { user: { email: HEAD_ADMIN_EMAIL } },
      expect: {
        statusCode: HTTP.BAD_REQUEST,
      },
    });

    addTest({
      description: `returns ${HTTP.OK} with 2 items`,
      query: {
        ...workspaceQuery,
        page: 1,
        perPage: APP.MAX_ITEMS_PER_PAGE,
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
        ...workspaceQuery,
        page: 1,
        name: BLUEPRINT_1.name,
        perPage: APP.MAX_ITEMS_PER_PAGE,
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
        ...workspaceQuery,
        page: 1,
        inUse: 1,
        perPage: APP.MAX_ITEMS_PER_PAGE,
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
