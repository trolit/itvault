import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { DeepPartial, FindOptionsWhere, UpdateResult } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: number | string): Promise<T | null>;

  softDeleteById(id: number | string): Promise<UpdateResult>;

  createEntityInstance(properties?: DeepPartial<T>): T;

  getAll(
    where: FindOptionsWhere<T>,
    options?: { pagination?: IPaginationOptions }
  ): Promise<[T[], number]>;
}
