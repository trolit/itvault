import TestAgent from "supertest/lib/agent";
import { PASSWORD, ROUTER_VERSION_PREFIX } from "@integration-tests/config";
import {
  Method,
  TestData,
  RequestFunc,
  UserSession,
  TestInstance,
  CommonMethods,
  IRouterInformation,
  IRequestInformation,
} from ".";

import { APP, JWT } from "@config";

import { BaseController } from "@controllers/BaseController";

const {
  ALL_VERSION_DEFINITIONS: { v1 },
} = BaseController;

let supertest: TestAgent;
let availableGlobalCookies: Record<string, string>;

export function useTestAgent(agent: TestAgent): CommonMethods;
export function useTestAgent(
  agent: TestAgent,
  testData: TestData
): TestInstance;
export function useTestAgent(
  agent: TestAgent,
  testData?: TestData
): CommonMethods | TestInstance {
  supertest = agent;

  const commonMethods = {
    getUrl,
    authenticate,
    customRequest,
    extractTokenFromCookie,
  };

  if (testData) {
    const { globalCookie, ...otherData } = testData;

    availableGlobalCookies = globalCookie;

    return {
      ...commonMethods,
      request: prepareRequest({ ...otherData }),
    };
  }

  return commonMethods;
}

function extractTokenFromCookie(arg: { cookie: string }) {
  const { cookie } = arg;

  const startText = `${JWT.COOKIE_KEY}=`;
  const endText = ";";

  const start = cookie.indexOf(startText) + startText.length;
  const end = cookie.indexOf(endText, start);

  return cookie.substring(start, end);
}

function prepareRequest<Q extends { version: number }, B = void>(arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}): RequestFunc<Q, B> {
  const {
    router,
    request: { action, method, query: baseQuery, body: baseBody },
  } = arg;

  const url = getUrl({ router, action });

  return data => {
    const { query, body, session } = data;

    return sendRequest({
      url,
      method,
      session,
      body: body || baseBody,
      query: query || baseQuery,
    });
  };
}

function customRequest<Q extends { version: number }, B = void>(arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}) {
  const {
    router,
    request: { action, method, query, body, session },
  } = arg;

  const url = getUrl({ router, action });

  return sendRequest({
    method,
    url,
    body,
    query,
    session,
  });
}

function sendRequest(arg: {
  method: Method;
  url: string;
  body: any;
  query: any;
  session?: UserSession;
}) {
  const { method, url, session, query, body } = arg;

  const request = supertest[method](url);

  if (query) {
    request.query(query);
  }

  if (session) {
    request.set("Cookie", useToken(session));
  }

  return body ? request.send(body) : request.send();
}

function getUrl(arg: { router: IRouterInformation; action: string }) {
  const {
    action,
    router: { version, name },
  } = arg;

  const branchVersion = `${ROUTER_VERSION_PREFIX}${version}`;

  return `${APP.ROUTES_PREFIX}/${branchVersion}/${name}/${action}`;
}

async function authenticate(
  user: { email: string },
  options?: {
    routerVersion?: number;
    requestVersion?: number;
  }
): Promise<string> {
  const { email } = user;

  const url = getUrl({
    action: "sign-in",
    router: {
      version: options?.routerVersion || v1,
      name: "auth",
    },
  });

  const response = await supertest
    .post(url)
    .query({ version: options?.requestVersion || v1 })
    .send({ email, password: PASSWORD });

  const [token] = response.headers["set-cookie"];

  if (!token && token.includes(JWT.COOKIE_KEY)) {
    throw Error(`Should have ${JWT.COOKIE_KEY} cookie!`);
  }

  return token;
}

function useToken(session: UserSession) {
  if ("user" in session) {
    const {
      user: { email },
    } = session;

    if (!availableGlobalCookies[email]) {
      throw Error(
        `Expected to have global session of ${email} but it wasn't found!`
      );
    }

    return [availableGlobalCookies[email]];
  }

  return [session["cookie"]];
}
