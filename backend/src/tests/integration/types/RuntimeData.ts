import TestAgent from "supertest/lib/agent";
import { ISession } from "./ISession";

export type RuntimeData = {
  supertest: TestAgent | null;

  sessions: ISession[];
};
