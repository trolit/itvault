import { Response } from "supertest";

import { IBaseTest } from "./IBaseTest";

export interface ITest<Q = void, B = void> extends IBaseTest<Q, B> {
  sendAs?: string;

  query?: Q & { version: number };

  expect: {
    statusCode: number;

    callback?: (response: Response) => void;
  };
}
