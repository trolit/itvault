import { FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { Type } from "@utils/types";
import { dataSource } from "@config/data-source";
import { IBaseRepository } from "@interfaces/IBaseRepository";

export class BaseRepository<T extends { id: number }>
  implements IBaseRepository<T>
{
  protected database: Repository<T>;

  constructor(entity: Type<T>) {
    this.database = dataSource.getRepository(entity);
  }

  findById(id: number): Promise<T | null> {
    return this.database.findOneBy({ id } as FindOptionsWhere<T>);
  }

  softDeleteById(id: number): Promise<UpdateResult> {
    return this.database.softDelete({ id } as FindOptionsWhere<T>);
  }
}
