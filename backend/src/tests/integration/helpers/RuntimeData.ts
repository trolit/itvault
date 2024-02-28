import { Server } from "http";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { IRuntimeData } from "../types/IRuntimeData";

export class RuntimeData implements IRuntimeData {
  private _app: Server;
  private _supertest: TestAgent;
  private _jsonwebtokens: Record<string, string>;

  constructor(app: Server, jsonwebtokens: Record<string, string>) {
    this._app = app;

    this._jsonwebtokens = jsonwebtokens;

    this._supertest = supertest(app);
  }

  getData() {
    return {
      app: this._app,
      supertest: this._supertest,
      jsonwebtokens: this._jsonwebtokens,
    };
  }
}
