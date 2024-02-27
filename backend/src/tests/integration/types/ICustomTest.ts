import { Response } from "supertest";
import { IBaseTest } from "./IBaseTest";
import { TestAgentTypes } from "./TestAgent";
import { RouterInformation } from "./RouterInformation";

export interface ICustomTest extends IBaseTest<any, any> {
  statusCode: number;

  runner: (arg: {
    url: string;
    router: RouterInformation;
    testAgent: TestAgentTypes.CustomTestInstance;
  }) => Promise<Response>;
}
