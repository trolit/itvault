import { Response } from "supertest";
import { IBaseTest } from "./IBaseTest";
import TestAgent from "supertest/lib/agent";

export interface ICustomTest extends IBaseTest {
  statusCode: number;

  runner: (arg: { url: string; supertest: TestAgent }) => Promise<Response>;
}
