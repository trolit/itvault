import { roleNameToEmail } from "@db/seeds/helpers/roleNameToEmail";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { IUserRepository } from "types/repositories/IUserRepository";

import { MEMBER_ROLE } from "@config/initial-roles";

import { Di } from "@enums/Di";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const PASSWORD = "1234";

export const HEAD_ADMIN_EMAIL = roleNameToEmail(HEAD_ADMIN_ROLE.name);
export const MEMBER_EMAIL = roleNameToEmail(MEMBER_ROLE.name);

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
