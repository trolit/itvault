import { Server } from "http";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { IRuntimeData } from "../types/IRuntimeData";
import { HEAD_ADMIN_EMAIL, MEMBER_EMAIL } from "../config";

export class RuntimeData implements IRuntimeData {
  private _app: Server;
  private _supertest: TestAgent;
  private _jsonwebtokens: Record<string, string> = {
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
      jsonwebtokens: this._jsonwebtokens,
    };
  }

  addJsonWebToken(arg: { email: string; token: string }) {
    const { email, token } = arg;

    this._jsonwebtokens[email] = token;
  }
}
