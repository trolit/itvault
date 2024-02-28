import { Server } from "http";
import TestAgent from "supertest/lib/agent";
import { TestAgentTypes } from "./TestAgent";

export type RuntimeData = {
  app?: Server;

  supertest?: TestAgent;

  jsonwebtokens: Pick<TestAgentTypes.TestData, "jsonwebtokens">;
};
