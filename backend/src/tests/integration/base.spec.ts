import "reflect-metadata";
import { Server } from "http";
import request from "supertest";
import { server } from "../../server";

import { APP } from "@config";
import { MEMBER_ROLE } from "@config/initial-roles";

import { AUTH_TESTS } from "./controllers/Auth";
import { RuntimeData } from "./types/RuntimeData";
import { addUsers } from "./helpers/user-helpers";
import { containers } from "./helpers/containers";
import { HEAD_ADMIN_EMAIL, MEMBER_EMAIL } from "./common-data";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

const { PORT } = APP;

describe("Integration tests", function () {
  let _app: Server;

  const runtimeData: RuntimeData = { supertest: null, sessions: [] };

  this.timeout(10000);

  before(done => {
    server().then(app => {
      _app = app;

      app.listen(PORT, async () => {
        const supertest = request(app);

        runtimeData.supertest = supertest;

        await initializeTestingEnvironment();

        AUTH_TESTS.beforeAll(this);

        done();
      });
    });
  });

  AUTH_TESTS.loadToSuite(this, runtimeData);

  after(async () => {
    _app.close();

    await containers.down();
  });
});

async function initializeTestingEnvironment() {
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
}
