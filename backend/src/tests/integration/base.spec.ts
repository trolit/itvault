import "reflect-metadata";
import { Server } from "http";
import supertest from "supertest";
import { server } from "../../server";

import { APP } from "@config";
import { MEMBER_ROLE } from "@config/initial-roles";

import { AUTH_TESTS } from "./controllers/Auth";
import { RuntimeData } from "./types/RuntimeData";
import { containers } from "./helpers/containers";
import { addUsers } from "./helpers/user-helpers";
import { useTestAgent } from "./helpers/useTestAgent";
import { HEAD_ADMIN_EMAIL, MEMBER_EMAIL } from "./config";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

const { PORT } = APP;

export const RUNTIME_DATA: RuntimeData = {
  tokens: {
    [MEMBER_EMAIL]: "",
    [HEAD_ADMIN_EMAIL]: "",
  },
};

describe("Integration tests", function () {
  this.timeout(10000);

  before(done => {
    server().then(app => {
      app.listen(PORT, async () => {
        await prepareTestingEnvironment(app);

        AUTH_TESTS.beforeAll(this);

        done();
      });
    });
  });

  AUTH_TESTS.loadToSuite(this, RUNTIME_DATA);

  after(() => {
    const { app } = RUNTIME_DATA;

    return new Promise(resolve => {
      if (!app) {
        throw Error(`App not working or stopped earlier..`);
      }

      app?.close(async () => {
        await containers.down();

        resolve("ok");
      });
    });
  });
});

async function prepareTestingEnvironment(app: Server) {
  const request = supertest(app);

  RUNTIME_DATA.app = app;
  RUNTIME_DATA.supertest = request;

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

  const testAgent = useTestAgent(request);

  // @TODO get keys of initial state from "tokens"
  const [HEAD_ADMIN_TOKEN, MEMBER_TOKEN] = await Promise.all([
    testAgent.authenticate({ email: HEAD_ADMIN_EMAIL }),
    testAgent.authenticate({ email: MEMBER_EMAIL }),
  ]);

  RUNTIME_DATA.tokens = {
    [HEAD_ADMIN_EMAIL]: HEAD_ADMIN_TOKEN,
    [MEMBER_EMAIL]: MEMBER_TOKEN,
  };
}
