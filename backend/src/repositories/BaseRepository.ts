import {
  Repository,
  DeepPartial,
  QueryRunner,
  UpdateResult,
  FindOptionsWhere,
} from "typeorm";

import { Type } from "@common-types";
import { dataSource } from "@config/data-source";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IBaseRepository } from "@interfaces/repository/IBaseRepository";

export class BaseRepository<T extends { id: number | string }>
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

  findById(id: number | string): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  softDeleteById(id: number | string): Promise<UpdateResult> {
    return this.database.softDelete({ id } as FindOptionsWhere<T>);
  }

  createEntityInstance(properties?: DeepPartial<T>): T {
    if (!properties) {
      return this.database.create();
    }

    return this.database.create(properties);
  }

  getAll(
    where: FindOptionsWhere<T>,
    options?: { pagination?: IPaginationOptions }
  ): Promise<[T[], number]> {
    const paginationOptions = options?.pagination
      ? { skip: options.pagination.skip, take: options.pagination.take }
      : undefined;

    return this.database.findAndCount({ where, ...paginationOptions });
  }
}
