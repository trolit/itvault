import { Server } from "http";
import TestAgent from "supertest/lib/agent";

export type RuntimeData = {
  app?: Server;

  supertest?: TestAgent;

  tokens: Record<string, string>;
};
