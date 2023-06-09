import { DeepPartial, UpdateResult } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: number): Promise<T | null>;

  softDeleteById(id: number): Promise<UpdateResult>;

  createEntityInstance(properties?: DeepPartial<T>): T;
}
