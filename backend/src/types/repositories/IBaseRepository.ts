import {
  DeepPartial,
  QueryRunner,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IBaseRepository<T> {
  createEntity(properties?: DeepPartial<T>): T;

  getAllAndCount(options: FindManyOptions<T>): Promise<[T[], number]>;

  getOne(options: FindOneOptions<T>): Promise<T | null>;

  getById(id: number | string): Promise<T | null>;

  softDelete(options: FindOptionsWhere<T>): Promise<UpdateResult>;

  softDeleteEntity(entity: T): Promise<T>;

  primitiveSave(entity: DeepPartial<T>): Promise<T>;

  primitiveUpdate(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult>;

  useTransaction(): Promise<QueryRunner>;
}
