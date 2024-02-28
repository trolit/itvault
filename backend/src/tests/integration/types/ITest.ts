import { Response } from "supertest";

import { IBaseTest } from "./IBaseTest";
import { TestAgentTypes } from "./TestAgent";

export interface ITest<Q = void, B = void> extends IBaseTest<Q, B> {
  session?: TestAgentTypes.UserSession;

  query?: Q & { version: number };

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
