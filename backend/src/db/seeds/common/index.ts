import {
  Brackets,
  Repository,
  ObjectLiteral,
  WhereExpressionBuilder,
} from "typeorm";

export const DOMAIN = "itvault.dev";
export const PASSWORD = "1234";

export function generateEmailByRoleName(name: string) {
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
