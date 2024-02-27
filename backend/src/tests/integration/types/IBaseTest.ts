import { Method } from "./Method";

export interface IBaseTest {
  method: Method;

  description: string;

  query: any;

  body: any;
}
