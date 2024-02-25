import { Response } from "supertest";

import TestAgent from "supertest/lib/agent";

export interface ICustomTest {
  description: string;

  customRunner?: (arg: {
    url: string;
    superTest: TestAgent;
  }) => Promise<Response>;
}
