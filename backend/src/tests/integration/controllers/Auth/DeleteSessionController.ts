import { Method } from "tests/integration/types/Method";
import { StatusCodes as HTTP } from "http-status-codes";
import { PASSWORD } from "tests/integration/common-data";
import { buildTests } from "tests/integration/helpers/buildTests";
import { versionToString } from "tests/integration/helpers/versionToString";

import { IUserSessionDTO } from "@shared/types/DTOs/Auth";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export const DELETE_SESSION_MEMBER1_EMAIL = "session-delete-member1@email.com";
export const DELETE_SESSION_MEMBER2_EMAIL = "session-delete-member2@email.com";

const query = { version: v1 };

export const DELETE_SESSION_CONTROLLER_V1_TESTS = buildTests(
  { method: Method.DELETE, baseQuery: { version: v1 } },

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
      runner: async ({ url, supertest }) => {
        const signInResponse = await supertest
          .post(`/api/${versionToString(v1)}/auth/sign-in`)
          .query(query)
          .send({
            email: DELETE_SESSION_MEMBER1_EMAIL,
            password: PASSWORD,
          });

        const [token] = signInResponse.headers["set-cookie"];

        const sessionsResponse = await supertest
          .get(`/api/${versionToString(v1)}/auth/sessions`)
          .set("Cookie", [token])
          .query(query)
          .send();

        const [userSession] = <IUserSessionDTO[]>sessionsResponse.body;

        const response = await supertest
          .delete(`${url}/${userSession.sessionId}`)
          .set("Cookie", [token])
          .query(query)
          .send();

        return response;
      },
    });

    addCustomTest({
      description: `returns ${HTTP.NO_CONTENT} when user deletes session`,
      statusCode: HTTP.NO_CONTENT,
      runner: async ({ url, supertest }) => {
        const firstSignInResponse = await supertest
          .post(`/api/${versionToString(v1)}/auth/sign-in`)
          .query(query)
          .send({
            email: DELETE_SESSION_MEMBER2_EMAIL,
            password: PASSWORD,
          });

        const [firstSignInToken] = firstSignInResponse.headers["set-cookie"];

        await supertest
          .post(`/api/${versionToString(v1)}/auth/sign-in`)
          .query(query)
          .send({
            email: DELETE_SESSION_MEMBER2_EMAIL,
            password: PASSWORD,
          });

        const sessionsResponse = await supertest
          .get(`/api/${versionToString(v1)}/auth/sessions`)
          .set("Cookie", [firstSignInToken])
          .query(query)
          .send();

        const sessions = <IUserSessionDTO[]>sessionsResponse.body;

        const session = sessions.find(session => !session.isRequesterSession);

        if (!session) {
          throw Error("Did not find any secondary session!!");
        }

        const response = await supertest
          .delete(`${url}/${session.sessionId}`)
          .set("Cookie", [firstSignInToken])
          .query(query)
          .send();

        return response;
      },
    });
  }
);
