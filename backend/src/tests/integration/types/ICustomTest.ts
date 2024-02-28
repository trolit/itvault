import { Response } from "supertest";
import { IBaseTest } from "./IBaseTest";
import { TestAgentTypes } from "./TestAgent";
import { RouterInformation } from "./RouterInformation";
import { RequestInformation } from "./RequestInformation";

export interface ICustomTest extends IBaseTest<any, any> {
  statusCode: number;

  runner: (arg: {
    url: string;
    router: RouterInformation;
    request: RequestInformation;
    testAgent: TestAgentTypes.TestInstance;
  }) => Promise<Response>;
}
