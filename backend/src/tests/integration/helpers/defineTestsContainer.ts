import Mocha from "mocha";
import { expect } from "chai";
import { ITest } from "../types/ITest";
import TestAgent from "supertest/lib/agent";
import { ISession } from "../types/ISession";
import { RuntimeData } from "../types/RuntimeData";
import { ICustomTest } from "../types/ICustomTest";

import { versionToString } from "./versionToString";

export const defineTestsContainer = (arg: {
  name: string;
  route: string;
  before?: Mocha.Func;
  collection: {
    route: string;
    controller: string;
    testData: {
      routerVersion: number;
      tests: (ITest<any, any> | ICustomTest)[];
    }[];
  }[];
}) => {
  const { name, route: mainRoute, before: entityBefore, collection } = arg;

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
        const { controller, testData, route: collectionRoute } = element;

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
                const { supertest, sessions } = runtimeData;

                if (!supertest) {
                  return;
                }

                const url = `/api/${translatedRouterVersion}/${mainRoute}/${collectionRoute}`;

                await executeTest({ url, supertest, test, sessions });
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
  sessions: ISession[];
  test: ITest<any, any> | ICustomTest;
}) {
  const { supertest, test, url, sessions } = arg;
  if ("runner" in test) {

    const response = await test.runner({ url, supertest });

    expect(response.status).to.eql(test.statusCode);
  } else {
    const {
      method,
      query,
      body,
      sendAs,
      expect: { statusCode, callback },
    } = test;

    const request = supertest[method](url).query(query);

    if (sendAs) {
      const session = findSessionOrThrowError({ sessions, email: sendAs });

      request.set("Cookie", [session.value]);
    }

    const response = await request.send(body);

    if (callback) {
      callback(response);
    }

    expect(response.status).to.eql(statusCode);
  }
}

function findSessionOrThrowError(arg: { sessions: ISession[]; email: string }) {
  const { sessions, email } = arg;

  const session = sessions.find(element => element.email === email);

  if (!session) {
    throw Error(
      `Attempted to resolve session for ${email} but it wasn't found!`
    );
  }

  return session;
}
