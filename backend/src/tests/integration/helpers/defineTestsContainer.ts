import Mocha from "mocha";
import { expect } from "chai";
import { ITest } from "../types/ITest";
import TestAgent from "supertest/lib/agent";

import { versionToString } from "./versionToString";

export const defineTestsContainer = (arg: {
  name: string;
  route: string;
  before?: Mocha.Func;
  collection: {
    controller: string;
    testData: { routerVersion: number; tests: ITest<any, any>[] }[];
  }[];
}) => {
  const { name, route: entityRoute, before: entityBefore, collection } = arg;

  return {
    loadToSuite: (
      suite: Mocha.Suite,
      tools: { supertest: TestAgent | null }
    ) => {
      const entitySuite = Mocha.Suite.create(suite, `${name}`);

      if (entityBefore) {
        entitySuite.beforeAll(entityBefore);
      }

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

                const {
                  method,
                  query,
                  body,
                  expect: { statusCode, callback },
                } = test;

                const response = await supertest[method](
                  `/api/${translatedRouterVersion}/${entityRoute}`
                )
                  .query(query)
                  .send(body);

                expect(response.status).to.eql(statusCode);

                if (callback) {
                  callback(response);
                }
              }
            );
            controllerSuite.addTest(mochaTest);
          }
        }
      }
    },
  };
};
