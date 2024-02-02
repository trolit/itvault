import { Tag } from "@db/entities/Tag";
import { QueryRunner, SaveOptions } from "typeorm";
import { IBaseRepository } from "./IBaseRepository";

export interface ITagRepository extends IBaseRepository<Tag> {
  transactionSaveMany(transaction: QueryRunner, tags: string[]): Promise<Tag[]>;
}
