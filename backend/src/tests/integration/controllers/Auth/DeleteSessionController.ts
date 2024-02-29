import { StatusCodes as HTTP } from "http-status-codes";
import { Method } from "@integration-tests/types/Method";
import { buildTests } from "@integration-tests/helpers/buildTests";

import { IUserSessionDTO } from "@shared/types/DTOs/Auth";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const DELETE_SESSION_MEMBER1_EMAIL = "session-delete-member1@email.com";
export const DELETE_SESSION_MEMBER2_EMAIL = "session-delete-member2@email.com";

export const DELETE_SESSION_CONTROLLER_V1_TESTS = buildTests(
  {
    method: Method.DELETE,
    baseQuery: { version: v1 },
  },

  ({ addTest, addCustomTest }) => {
    addTest({
      description: `returns ${HTTP.UNAUTHORIZED} when user is not signed in`,
      expect: {
        statusCode: HTTP.UNAUTHORIZED,
      },
    });

    addCustomTest({
      description: `returns ${HTTP.BAD_REQUEST} when user wants to delete session used to fire DELETE request`,
      statusCode: HTTP.BAD_REQUEST,
      runner: async ({ testAgent, router, request }) => {
        const cookie = await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER1_EMAIL,
        });

        const { action, query } = request;

        const sessionsResponse = await testAgent.customRequest({
          router,
          request: {
            method: Method.GET,
            session: { cookie },
            action,
            query,
          },
        });

        const [userSession] = <IUserSessionDTO[]>sessionsResponse.body;

        return testAgent.customRequest({
          router,
          request: {
            ...request,
            session: { cookie },
            action: `${action}/${userSession.sessionId}`,
          },
        });
      },
    });

    addCustomTest({
      description: `returns ${HTTP.NO_CONTENT} when user deletes session`,
      statusCode: HTTP.NO_CONTENT,
      runner: async ({ testAgent, router, request }) => {
        const cookie = await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER2_EMAIL,
        });

        await testAgent.authenticate({
          email: DELETE_SESSION_MEMBER2_EMAIL,
        });

        const { action, query } = request;

        const sessionsResponse = await testAgent.customRequest({
          router,
          request: {
            method: Method.GET,
            session: { cookie },
            action,
            query,
          },
        });

        const sessions = <IUserSessionDTO[]>sessionsResponse.body;

        const session = sessions.find(session => !session.isRequesterSession);

        if (!session) {
          throw Error("Did not find any secondary session!!");
        }

        return testAgent.customRequest({
          router,
          request: {
            ...request,
            session: { cookie },
            action: `${action}/${session.sessionId}`,
          },
        });
      },
    });
  }
);
