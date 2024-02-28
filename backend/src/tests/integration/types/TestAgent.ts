import { Response } from "supertest";
import { RouterInformation } from "./RouterInformation";
import { RequestInformation } from "./RequestInformation";

export namespace TestAgentTypes {
  export type UserSession =
    | { user: { email: string } }
    | { jsonwebtoken: string };

  export type TestData = {
    router: RouterInformation;
    request: RequestInformation<any, any>;
    jsonwebtokens: Record<string, string>;
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
  };

  export type TestInstance = CommonMethods & {
    request: RequestFunc<any, any>;
  };

  export type RequestInstance = CommonMethods & {};
}
