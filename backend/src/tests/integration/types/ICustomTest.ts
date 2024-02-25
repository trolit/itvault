import { Response } from "supertest";

import TestAgent from "supertest/lib/agent";

export interface ICustomTest {
  description: string;

  customRunner: (arg: {
    url: string;
    supertest: TestAgent;
  }) => Promise<Response>;
}
