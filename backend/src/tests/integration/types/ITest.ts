import { Response } from "supertest";

import { Method } from "./Method";
import { IBaseTest } from "./IBaseTest";

export interface ITest<Q = void, B = void> extends IBaseTest {
  method: Method;

  body?: B;

  query?: Q;

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
