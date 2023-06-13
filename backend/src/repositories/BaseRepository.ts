import {
  Repository,
  DeepPartial,
  QueryRunner,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from "typeorm";

import { Type } from "@common-types";
import { dataSource } from "@config/data-source";
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

  getById(id: number | string): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  softDeleteById(id: number | string): Promise<UpdateResult> {
    return this.database.softDelete({ id } as FindOptionsWhere<T>);
  }

  createEntity(properties?: DeepPartial<T>): T {
    if (!properties) {
      return this.database.create();
    }

    return this.database.create(properties);
  }

  getAll(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.database.findAndCount(options);
  }

  getOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.database.findOne(options);
  }

  saveEntity(entity: DeepPartial<T>): Promise<T> {
    return this.database.save(entity);
  }
}
