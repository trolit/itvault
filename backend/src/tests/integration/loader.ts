import "reflect-metadata";
import { Server } from "http";
import { container } from "tsyringe";
import { server } from "../../server";

import { APP } from "@config";
import { MEMBER_ROLE } from "@config/initial-roles";

import { addUsers } from "./helpers/db/addUsers";
import { containers } from "./helpers/containers";
import { IRuntimeData } from "./types/IRuntimeData";
import { RuntimeData } from "./helpers/RuntimeData";
import { ITestsGroup, loadTestsGroups, useTestAgent } from "./probata";
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
let TESTS_GROUPS: ITestsGroup[];

describe("Integration tests", async function () {
  this.timeout(TESTS_TIMEOUT);

  before(done => {
    server().then(app => {
      app.listen(PORT, async () => {
        await prepareTestingEnvironment(this, app);

        done();
      });
    });
  });

  TESTS_GROUPS = await loadTestsGroups(this, PATH_TO_CONTROLLERS_TESTS);

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

async function prepareTestingEnvironment(suite: Mocha.Suite, app: Server) {
  for (const testsGroup of TESTS_GROUPS) {
    testsGroup.beforeAll(suite);
  }

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
