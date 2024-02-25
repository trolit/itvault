import Mocha from "mocha";
import { expect } from "chai";
import { ITest } from "../types/ITest";
import TestAgent from "supertest/lib/agent";
import { ICustomTest } from "../types/ICustomTest";

import { isCustomTest } from "./isCustomTest";
import { versionToString } from "./versionToString";

export const defineTestsContainer = (arg: {
  name: string;
  route: string;
  before?: Mocha.Func;
  collection: {
    controller: string;
    testData: {
      routerVersion: number;
      tests: (ITest<any, any> | ICustomTest)[];
    }[];
  }[];
}) => {
  const { name, route: entityRoute, before: entityBefore, collection } = arg;

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
    loadToSuite: (
      suite: Mocha.Suite,
      tools: { supertest: TestAgent | null }
    ) => {
      const entitySuite = Mocha.Suite.create(suite, `${name}`);

      for (const element of collection) {
        const { controller, testData } = element;

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
                const { supertest } = tools;

                if (!supertest) {
                  return;
                }

                const url = `/api/${translatedRouterVersion}/${entityRoute}`;

                await executeTest({ url, supertest, test });
              }
            );

            controllerSuite.addTest(mochaTest);
          }
        }
      }
    },
  };
};

async function executeTest(arg: {
  url: string;
  supertest: TestAgent;
  test: ITest<any, any> | ICustomTest;
}) {
  const { supertest, test, url } = arg;

  if (isCustomTest(test)) {
    const response = await test.runner({ url, supertest });

    expect(response.status).to.eql(test.statusCode);
  } else {
    const {
      method,
      query,
      body,
      expect: { statusCode, callback },
    } = test;

    const response = await supertest[method](url).query(query).send(body);

    expect(response.status).to.eql(statusCode);

    if (callback) {
      callback(response);
    }
  }
}
