import { PASSWORD } from "../config";
import TestAgent from "supertest/lib/agent";
import { ISession } from "../types/ISession";
import { IUserRepository } from "types/repositories/IUserRepository";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { versionToString } from "./versionToString";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

export async function addUsers(
  users: { email: string; isSignedUp: boolean; roleNameOrId: number | string }[]
) {
  const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);
  const roleRepository = getInstanceOf<IRoleRepository>(Di.RoleRepository);

  for (const user of users) {
    const { email, isSignedUp, roleNameOrId } = user;

    let role;
    const isId = typeof roleNameOrId === "number";

    if (!isId) {
      const roleRecord = await roleRepository.getOne({
        where: {
          name: roleNameOrId,
        },
      });

      if (roleRecord) {
        role = roleRecord;
      }
    }

    await userRepository.primitiveSave({
      firstName: "F123N",
      lastName: "L123N",
      email,
      password: PASSWORD,
      isSignedUp,
      role: isId ? { id: roleNameOrId } : role,
    });
  }
}

export async function getSessions(arg: {
  emails: string[];
  supertest: TestAgent;
}): Promise<ISession[]> {
  const { emails, supertest } = arg;
  const translatedRouterVersion = versionToString(v1);

  const result: ISession[] = [];
  const url = `/api/${translatedRouterVersion}/auth/sign-in`;

  for (const email of emails) {
    const body = { email, password: PASSWORD };

    const response = await supertest
      .post(url)
      .query({ version: v1 })
      .send(body);

    const [token] = response.headers["set-cookie"];

    result.push({
      email,
      value: token,
    });
  }

  return result;
}
