import { Response } from "supertest";
import { RouterInformation } from "./RouterInformation";
import { RequestInformation } from "./RequestInformation";

export namespace TestAgentTypes {
  // @NOTE when using email - cookie is read from RuntimeData.cookie object
  export type UserSession = { user: { email: string } } | { cookie: string };

  export type TestData = {
    router: RouterInformation;
    request: RequestInformation<any, any>;
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
    router: RouterInformation;
    action: string;
  }) => string;

  export type ExtractTokenFromCookieFunc = (arg: { cookie: string }) => string;

  export type RequestFunc<Q extends { version: number }, B = void> = (data: {
    query?: Q;
    body?: B;
    session?: UserSession;
  }) => Promise<Response>;

  export type CustomRequestFunc<
    Q extends { version: number },
    B = void
  > = (arg: {
    router: RouterInformation;
    request: RequestInformation<Q, B>;
  }) => Promise<Response>;

  // ------------------------------------------------

  type CommonMethods = {
    getUrl: GetUrlFunc;
    authenticate: AuthenticateFunc;
    customRequest: CustomRequestFunc<any, any>;
    extractTokenFromCookie: ExtractTokenFromCookieFunc;
  };

  export type TestInstance = CommonMethods & {
    request: RequestFunc<any, any>;
  };

  export type RequestInstance = CommonMethods & {};
}
