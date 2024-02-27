import { Method } from "./Method";

export interface IBaseTest<Q = void, B = void> {
  method: Method;

  description: string;

  query?: Q;

  body?: B;
}
