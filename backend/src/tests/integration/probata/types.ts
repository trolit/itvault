import { Response } from "supertest";

export enum Method {
  POST = "post",
  PUT = "put",
  GET = "get",
  DELETE = "delete",
}

export interface IRouterInformation {
  version: number;

  name: string;
}

export interface IRequestInformation<Q = void, B = void> {
  method: Method;
  action: string;
  query: Q;
  body?: B;
  session?: UserSession;
}

// @NOTE when using email - cookie is read from RuntimeData.cookie object
export type UserSession = { user: { email: string } } | { cookie: string };

export type TestData = {
  router: IRouterInformation;
  request: IRequestInformation<any, any>;
  globalCookie: Record<string, string>;
};

export type AuthenticateFunc = (
  user: { email: string },
  options?: {
    routerVersion?: number;
    requestVersion?: number;
  }
) => Promise<string>;

export type GetUrlFunc = (arg: {
  router: IRouterInformation;
  action: string;
}) => string;

export type ExtractTokenFromCookieFunc = (arg: { cookie: string }) => string;

export type RequestFunc<Q extends { version: number }, B = void> = (data: {
  query?: Q;
  body?: B;
  session?: UserSession;
}) => Promise<Response>;

export type CustomRequestFunc<Q extends { version: number }, B = void> = (arg: {
  router: IRouterInformation;
  request: IRequestInformation<Q, B>;
}) => Promise<Response>;

// ------------------------------------------------

export type CommonMethods = {
  getUrl: GetUrlFunc;
  authenticate: AuthenticateFunc;
  customRequest: CustomRequestFunc<any, any>;
  extractTokenFromCookie: ExtractTokenFromCookieFunc;
};

export type TestInstance = CommonMethods & {
  request: RequestFunc<any, any>;
};

export type TestsGroup = {
  beforeAll(suite: Mocha.Suite): void;

  loadToSuite(suite: Mocha.Suite): void;
};

export interface IBaseTest<Q = void, B = void> {
  method: Method;

  description: string;

  query?: Q;

  body?: B;
}

export interface ICustomTest extends IBaseTest<any, any> {
  statusCode: number;

  runner: (arg: {
    url: string;
    router: IRouterInformation;
    request: IRequestInformation;
    testAgent: TestInstance;
  }) => Promise<Response>;
}

export interface ITest<Q = any, B = any> extends IBaseTest<Q, B> {
  session?: UserSession;

  query?: Q & { version: number };

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
