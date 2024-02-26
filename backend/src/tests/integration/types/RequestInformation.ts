import { Method } from "./Method";

export type RequestInformation<Q = void, B = void> = {
  method: Method;
  action: string;
  query: Q;
  body?: B;
  session?: { user: { email: string } } | { token: string };
};
