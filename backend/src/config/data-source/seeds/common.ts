import { ALL_EDITABLE_ROLES, HEAD_ADMIN_ROLE } from "@config/default-roles";

export const DOMAIN = "itvault.dev";
export const PASSWORD = "1234";

const { name, permissions } = HEAD_ADMIN_ROLE;

const HEAD_ADMIN_ROLE_TEST_ACCOUNT = {
  email: generateEmailByRoleName(name),
  password: PASSWORD,
  permissions,
  roleName: name,
};

export const TEST_ACCOUNTS = [HEAD_ADMIN_ROLE_TEST_ACCOUNT].concat(
  ALL_EDITABLE_ROLES.map(({ name, permissions }) => ({
    email: generateEmailByRoleName(name),
    password: PASSWORD,
    permissions,
    roleName: name,
  }))
);

export const TEST_UNLOCKED_WORKSPACE = {
  name: "test 0001",
};

export const TEST_LOCKED_WORKSPACE = {
  name: "test 0010",
  password: PASSWORD,
};

export const TEST_COMMON_BLUEPRINT = {
  name: "Common",
  color: "#C6CED1",
};

function generateEmailByRoleName(name: string) {
  return `${name.toLowerCase().replace(/ /g, ".")}@${DOMAIN}`;
}
