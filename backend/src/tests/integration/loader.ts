import "reflect-metadata";
import fs from "fs-extra";
import { Server } from "http";
import { container } from "tsyringe";
import { server } from "../../server";

import { APP } from "@config";
import { MEMBER_ROLE } from "@config/initial-roles";

import { containers } from "./helpers/containers";
import { addUsers } from "./helpers/user-helpers";
import { IRuntimeData } from "./types/IRuntimeData";
import { RuntimeData } from "./helpers/RuntimeData";
import { TestsGroup, useTestAgent } from "./probata";
import {
  MEMBER_EMAIL,
  TESTS_TIMEOUT,
  HEAD_ADMIN_EMAIL,
  RUNTIME_DATA_DI_TOKEN,
  PATH_TO_CONTROLLERS_TESTS,
} from "./config";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { getInstanceOf } from "@helpers/getInstanceOf";

const { PORT } = APP;
const TESTS_GROUPS: TestsGroup[] = [];

const CONTROLLERS_TESTS_DIR_CONTENT = fs.readdirSync(PATH_TO_CONTROLLERS_TESTS);

describe("Integration tests", async function () {
  this.timeout(TESTS_TIMEOUT);

  before(done => {
    server().then(app => {
      app.listen(PORT, async () => {
        await prepareTestingEnvironment(app);

        for (const testsGroup of TESTS_GROUPS) {
          testsGroup.beforeAll(this);
        }

        done();
      });
    });
  });

  await loadTests(this);

  after(function (done) {
    this.timeout(TESTS_TIMEOUT);

    const { app } = getInstanceOf<IRuntimeData>(
      RUNTIME_DATA_DI_TOKEN
    ).getData();

    app.close(async () => {
      await containers.down();

      done();
    });
  });
});

async function loadTests(suite: Mocha.Suite) {
  for (const DIRNAME of CONTROLLERS_TESTS_DIR_CONTENT) {
    if (DIRNAME.includes(".")) {
      throw Error(
        `Path '${PATH_TO_CONTROLLERS_TESTS}' should only include dirs!`
      );
    }

    const module = await import(`./controllers/${DIRNAME}`);
    const value = `${DIRNAME.toUpperCase()}_TESTS`;

    const testsGroup = module[value];

    TESTS_GROUPS.push(testsGroup);

    testsGroup.loadToSuite(suite);
  }
}

async function prepareTestingEnvironment(app: Server) {
  // @TODO refactor
  await addUsers([
    {
      email: HEAD_ADMIN_EMAIL,
      isSignedUp: true,
      roleNameOrId: HEAD_ADMIN_ROLE.id,
    },
    {
      email: MEMBER_EMAIL,
      isSignedUp: true,
      roleNameOrId: MEMBER_ROLE.name,
    },
  ]);

  const runtimeData = new RuntimeData(app);

  await addGlobalCookies(runtimeData);

  container.register(RUNTIME_DATA_DI_TOKEN, { useValue: runtimeData });
}

async function addGlobalCookies(runtimeData: IRuntimeData) {
  const { globalCookie, supertest } = runtimeData.getData();
  const testAgent = useTestAgent(supertest);

  const emails = Object.keys(globalCookie);
  const { length } = emails;

  const cookies = await Promise.all(
    emails.map(email => testAgent.authenticate({ email }))
  );

  for (let index = 0; index < length; index++) {
    runtimeData.addGlobalCookie({
      email: emails[index],
      cookie: cookies[index],
    });
  }
}
