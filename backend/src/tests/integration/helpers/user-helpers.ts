import { PASSWORD } from "../config";
import { IUserRepository } from "types/repositories/IUserRepository";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

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
