import path from "path";
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
import { useTestAgent } from "./helpers/useTestAgent";
import { TestsContainer } from "./types/TestsContainer";
import {
  MEMBER_EMAIL,
  HEAD_ADMIN_EMAIL,
  RUNTIME_DATA_DI_TOKEN,
} from "./config";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { getInstanceOf } from "@helpers/getInstanceOf";

const { PORT } = APP;
const TESTS_CONTAINERS: TestsContainer[] = [];

const TIMEOUT = "10s";
const PATH_TO_CONTROLLERS_DIR = path.join(__dirname, "controllers");
const CONTROLLER_DIRS = fs.readdirSync(PATH_TO_CONTROLLERS_DIR);

describe("Integration tests", async function () {
  this.timeout(TIMEOUT);

  before(done => {
    server().then(app => {
      app.listen(PORT, async () => {
        await prepareTestingEnvironment(app);

        for (const testsCollection of TESTS_CONTAINERS) {
          testsCollection.beforeAll(this);
        }

        done();
      });
    });
  });

  await loadTests(this);

  after(function (done) {
    this.timeout(TIMEOUT);

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
  for (const DIRNAME of CONTROLLER_DIRS) {
    const module = await import(`./controllers/${DIRNAME}`);
    const valueName = `${DIRNAME.toUpperCase()}_TESTS`;

    const testsCollection = module[valueName];

    TESTS_CONTAINERS.push(testsCollection);

    testsCollection.loadToSuite(suite);
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

  await generateGlobalJsonWebTokens(runtimeData);

  container.register(RUNTIME_DATA_DI_TOKEN, { useValue: runtimeData });
}

async function generateGlobalJsonWebTokens(runtimeData: IRuntimeData) {
  const { jsonwebtokens, supertest } = runtimeData.getData();
  const testAgent = useTestAgent(supertest);

  const emails = Object.keys(jsonwebtokens);
  const { length } = emails;

  const tokens = await Promise.all(
    emails.map(email => testAgent.authenticate({ email }))
  );

  for (let index = 0; index < length; index++) {
    runtimeData.addJsonWebToken({ email: emails[index], token: tokens[index] });
  }
}
