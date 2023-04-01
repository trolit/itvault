import { UpdateResult } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: number): Promise<T | null>;

  softDeleteById(id: number): Promise<UpdateResult>;
}
