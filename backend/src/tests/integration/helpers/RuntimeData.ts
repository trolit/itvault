import { Server } from "http";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { IRuntimeData } from "@integration-tests/types/IRuntimeData";
import { HEAD_ADMIN_EMAIL, MEMBER_EMAIL } from "@integration-tests/config";

export class RuntimeData implements IRuntimeData {
  private _app: Server;
  private _supertest: TestAgent;
  private _globalCookie: Record<string, string> = {
    [MEMBER_EMAIL]: "",
    [HEAD_ADMIN_EMAIL]: "",
  };

  constructor(app: Server) {
    this._app = app;

    this._supertest = supertest(app);
  }

  getData() {
    return {
      app: this._app,
      supertest: this._supertest,
      globalCookie: this._globalCookie,
    };
  }

  addGlobalCookie(arg: { email: string; cookie: string }) {
    const { email, cookie } = arg;

    this._globalCookie[email] = cookie;
  }
}
