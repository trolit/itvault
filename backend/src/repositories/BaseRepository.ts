import {
  Repository,
  QueryRunner,
  UpdateResult,
  FindOptionsWhere,
} from "typeorm";

import { Type } from "@common-types";
import { dataSource } from "@config/data-source";
import { IBaseRepository } from "@interfaces/repository/IBaseRepository";

export class BaseRepository<T extends { id: number }>
  implements IBaseRepository<T>
{
  protected database: Repository<T>;

  protected useTransaction: () => Promise<QueryRunner>;

  constructor(entity: Type<T>) {
    this.database = dataSource.getRepository(entity);

    this.useTransaction = async () => {
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.startTransaction();

      return queryRunner;
    };
  }

  findById(id: number): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  softDeleteById(id: number): Promise<UpdateResult> {
    return this.database.softDelete({ id } as FindOptionsWhere<T>);
  }
}
