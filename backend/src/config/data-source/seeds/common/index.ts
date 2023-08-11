import { ObjectLiteral, Repository } from "typeorm";

import { HEAD_ADMIN_ROLE, ALL_EDITABLE_ROLES } from "@config/default-roles";

export const DOMAIN = "itvault.dev";
export const PASSWORD = "1234";

const { name, permissions } = HEAD_ADMIN_ROLE;

export const HEAD_ADMIN_ROLE_TEST_ACCOUNT = {
  email: generateEmailByRoleName(name),
  permissions,
  roleName: name,
};

export const TEST_ACCOUNTS = [HEAD_ADMIN_ROLE_TEST_ACCOUNT].concat(
  ALL_EDITABLE_ROLES.map(({ name, permissions }) => ({
    email: generateEmailByRoleName(name),
    permissions,
    roleName: name,
  }))
);

export const TEST_WORKSPACE_1 = {
  name: "test 0001",
};

export const TEST_WORKSPACE_2 = {
  name: "test 0010",
};

function generateEmailByRoleName(name: string) {
  return `${name.toLowerCase().replace(/ /g, ".")}@${DOMAIN}`;
}

export function getRandomRecords<T extends ObjectLiteral>(
  repository: Repository<T>,
  amount = 1
) {
  return repository
    .createQueryBuilder()
    .select()
    .orderBy("RAND()")
    .take(amount)
    .getMany();
}
