import TestAgent from "supertest/lib/agent";

export type RuntimeData = {
  supertest: TestAgent | null;

  sessions: { email: string; value: string }[];
};
