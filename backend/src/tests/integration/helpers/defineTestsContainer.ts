import Mocha from "mocha";
import { expect } from "chai";
import { Response } from "supertest";
import { ITest } from "../types/ITest";
import TestAgent from "supertest/lib/agent";
import { RuntimeData } from "../types/RuntimeData";
import { ICustomTest } from "../types/ICustomTest";
import { RouterInformation } from "../types/RouterInformation";

import { useTestAgent } from "./useTestAgent";
import { versionToString } from "./versionToString";

export const defineTestsContainer = (arg: {
  name: string;
  router: string;
  before?: Mocha.Func;
  collection: {
    action: string;
    controller: string;
    testData: {
      routerVersion: number;
      tests: (ITest<any, any> | ICustomTest)[];
    }[];
  }[];
}) => {
  const { name, router, before: entityBefore, collection } = arg;

  return {
    beforeAll(suite: Mocha.Suite) {
      if (entityBefore) {
        const relatedSuite = suite.suites.find(
          element => element.title === `${name}`
        );

        if (relatedSuite) {
          relatedSuite.beforeAll(entityBefore);
        }
      }
    },
    loadToSuite: (suite: Mocha.Suite, runtimeData: RuntimeData) => {
      const entitySuite = Mocha.Suite.create(suite, `${name}`);

      for (const element of collection) {
        const { controller, testData, action } = element;

        const controllerSuite = Mocha.Suite.create(
          entitySuite,
          `${controller}`
        );

        for (const element of testData) {
          const { routerVersion, tests } = element;
          const translatedRouterVersion = versionToString(routerVersion);

          for (const test of tests) {
            const mochaTest = new Mocha.Test(
              `${translatedRouterVersion} ${test.description}`,
              async () => {
                const { supertest, jsonwebtokens } = runtimeData;

                if (!supertest) {
                  throw Error(`Supertest not supplied!`);
                }

                await runTest({
                  test,
                  action,
                  supertest,
                  jsonwebtokens,
                  router: { version: routerVersion, name: router },
                });
              }
            );

            controllerSuite.addTest(mochaTest);
          }
        }
      }
    },
  };
};

async function runTest(arg: {
  action: string;
  supertest: TestAgent;
  router: RouterInformation;
  test: ITest<any, any> | ICustomTest;
  jsonwebtokens: Record<string, string>;
}) {
  const { action, supertest, router, test, jsonwebtokens } = arg;

  const request = {
    method: test.method,
    action,
    query: test.query,
    body: test.body,
  };

  const testAgent = useTestAgent(supertest, {
    router,
    request,
    jsonwebtokens,
  });

  const isCustomTest = "runner" in test;

  let response: Response;
  const statusCode = isCustomTest ? test.statusCode : test.expect.statusCode;

  if (isCustomTest) {
    const url = testAgent.getUrl({
      router,
      action,
    });

    response = await test.runner({ url, router, testAgent, request });
  } else {
    const {
      session,
      expect: { statusCode, callback },
    } = test;

    response = await testAgent.request({
      session,
    });

    if (callback) {
      callback(response);
    }
  }

  expect(response.status).to.eql(statusCode);
}
