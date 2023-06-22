import {
  Repository,
  DeepPartial,
  QueryRunner,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { Type } from "@common-types";
import { dataSource } from "@config/data-source";
import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

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

  getById(id: number | string): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  softDeleteById(id: number | string): Promise<UpdateResult> {
    return this.database.softDelete({ id } as FindOptionsWhere<T>);
  }

  primitiveSave(entity: DeepPartial<T>): Promise<T> {
    return this.database.save(entity);
  }

  primitiveUpdate(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    return this.database.update(options, partialEntity);
  }
}
