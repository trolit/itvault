import { Server } from "http";
import supertest from "supertest";
import { Method } from "../types/Method";
import { PASSWORD } from "../common-data";
import TestAgent from "supertest/lib/agent";
import { ISession } from "../types/ISession";
import { IRequestAgent } from "../types/IRequestAgent";
import { RouterInformation } from "../types/RouterInformation";
import { RequestInformation } from "../types/RequestInformation";

import { APP } from "@config";

import { ISignInDTO } from "@shared/types/DTOs/User";

export class RequestAgent implements IRequestAgent {
  private _supertest: TestAgent;
  private _globalSessions: ISession[];

  constructor(app: Server) {
    this._globalSessions = [];
    this._supertest = supertest(app);
  }

  async getToken(
    arg: {
      routerVersion: number;
      requestVersion: number;
      user: { email: string };
    },
    options?: { keep: boolean }
  ) {
    const { user, routerVersion, requestVersion } = arg;

    const router = { version: routerVersion, name: "auth" };

    const response = await this.sendRequest<any, ISignInDTO>({
      router,
      request: {
        method: Method.POST,
        action: "sign-in",
        body: { email: user.email, password: PASSWORD },
        query: { version: requestVersion },
      },
    });

    const [token] = response.headers["set-cookie"];

    if (options?.keep) {
      this._globalSessions.push({
        email: user.email,
        value: token,
      });
    }

    return token;
  }

  sendRequest<Q extends { version: number }, B = void>(arg: {
    router: RouterInformation;
    request: RequestInformation<Q, B>;
  }) {
    const {
      router,
      request: { action, method, query, body, session },
    } = arg;

    const url = this.getRequestUrl({ router, action });

    const request = this._supertest[method](url).query(query);

    if (session) {
      request.set("Cookie", this._useToken(session));
    }

    return body ? request.send(body) : request.send();
  }

  getRequestUrl(arg: { action: string; router: RouterInformation }) {
    const {
      router: { version, name },
      action,
    } = arg;

    const routerVersion = `v${version}`;

    return `/${APP.ROUTES_PREFIX}/${routerVersion}/${name}/${action}`;
  }

  private _useToken(arg: { user: { email: string } } | { token: string }) {
    if ("user" in arg) {
      const {
        user: { email },
      } = arg;

      const session = this._globalSessions.find(
        session => session.email === email
      );

      if (!session) {
        throw Error(
          `Expected to have global session of ${email} but it wasn't found!`
        );
      }

      return [session.value];
    }

    const { token } = arg;

    return [token];
  }
}
