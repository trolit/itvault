import {
  Brackets,
  ObjectLiteral,
  Repository,
  WhereExpressionBuilder,
} from "typeorm";

import { ALL_PERMISSIONS } from "@config/permissions";
import { ALL_EDITABLE_ROLES } from "@config/initial-roles";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export const DOMAIN = "itvault.dev";
export const PASSWORD = "1234";

export const HEAD_ADMIN_ROLE_TEST_ACCOUNT = {
  email: generateEmailByRoleName(HEAD_ADMIN_ROLE.name),
  permissions: ALL_PERMISSIONS,
  roleName: HEAD_ADMIN_ROLE.name,
};

export const TEST_ACCOUNTS = [HEAD_ADMIN_ROLE_TEST_ACCOUNT].concat(
  ALL_EDITABLE_ROLES.map(({ name, permissions }) => ({
    email: generateEmailByRoleName(name),
    permissions,
    roleName: name,
  }))
);

function generateEmailByRoleName(name: string) {
  return `${name.toLowerCase().replace(/ /g, ".")}@${DOMAIN}`;
}

export function getRandomRecords<T extends ObjectLiteral>(
  repository: Repository<T>,
  amount = 1,
  relationsToJoin?: string[],
  whereFactory?: (qb: WhereExpressionBuilder) => WhereExpressionBuilder
) {
  const queryAlias = "q";
  const queryBuilder = repository.createQueryBuilder(queryAlias);

  if (relationsToJoin) {
    for (const relationToJoin of relationsToJoin) {
      queryBuilder.leftJoinAndSelect(
        `${queryAlias}.${relationToJoin}`,
        relationToJoin
      );
    }
  } else {
    queryBuilder.select();
  }

  if (whereFactory) {
    queryBuilder.where(new Brackets(whereFactory));
  }

  return queryBuilder.orderBy("RAND()").take(amount).getMany();
}
