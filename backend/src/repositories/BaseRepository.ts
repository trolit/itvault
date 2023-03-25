import { FindOptionsWhere, Repository } from "typeorm";

import { Type } from "@utilities/types";
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
}
