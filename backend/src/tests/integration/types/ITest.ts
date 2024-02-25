import { Response } from "supertest";

import { Method } from "./Method";

export interface ITest<Q = void, B = void> {
  description: string;

  method: Method;

  body?: B;

  query?: Q;

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
