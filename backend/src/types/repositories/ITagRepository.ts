import { QueryRunner } from "typeorm";
import { Tag } from "@db/entities/Tag";
import { IBaseRepository } from "./IBaseRepository";

export interface ITagRepository extends IBaseRepository<Tag> {
  transactionSaveMany(transaction: QueryRunner, tags: string[]): Promise<Tag[]>;
}
