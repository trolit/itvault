import { DeepPartial, UpdateResult } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: number | string): Promise<T | null>;

  softDeleteById(id: number | string): Promise<UpdateResult>;

  createEntityInstance(properties?: DeepPartial<T>): T;
}
