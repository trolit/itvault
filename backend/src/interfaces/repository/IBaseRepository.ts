import {
  DeepPartial,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IBaseRepository<T> {
  softDeleteById(id: number | string): Promise<UpdateResult>;

  createEntity(properties?: DeepPartial<T>): T;

  getAll(options: FindManyOptions<T>): Promise<[T[], number]>;

  getOne(options: FindOneOptions<T>): Promise<T | null>;

  getById(id: number | string): Promise<T | null>;

  saveEntity(entity: DeepPartial<T>): Promise<T>;

  updateEntity(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult>;
}
