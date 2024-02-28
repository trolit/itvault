import { Server } from "http";
import TestAgent from "supertest/lib/agent";

export interface IRuntimeData {
  getData(): {
    app: Server;
    supertest: TestAgent;
    jsonwebtokens: Record<string, string>;
  };
}
