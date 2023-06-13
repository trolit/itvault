import {
  DeepPartial,
  UpdateResult,
  FindOneOptions,
  FindManyOptions,
} from "typeorm";

export interface IBaseRepository<T> {
  softDeleteById(id: number | string): Promise<UpdateResult>;

  createEntityInstance(properties?: DeepPartial<T>): T;

  getAll(options: FindManyOptions<T>): Promise<[T[], number]>;

  getOne(options: FindOneOptions<T>): Promise<T | null>;

  getById(id: number | string): Promise<T | null>;

  save(entity: DeepPartial<T>): Promise<T>;
}
