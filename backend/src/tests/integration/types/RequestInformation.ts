import { Method } from "./Method";
import { TestAgentTypes } from "./TestAgent";

export type RequestInformation<Q = void, B = void> = {
  method: Method;
  action: string;
  query: Q;
  body?: B;
  session?: TestAgentTypes.UserSession;
};
