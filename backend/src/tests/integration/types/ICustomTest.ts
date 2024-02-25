import { Response } from "supertest";

import TestAgent from "supertest/lib/agent";

export interface ICustomTest {
  description: string;

  statusCode: number;

  runner: (arg: { url: string; supertest: TestAgent }) => Promise<Response>;
}
