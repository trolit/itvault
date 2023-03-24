import { ObjectLiteral, Repository } from "typeorm";

import { Type } from "@utilities/types";
import { dataSource } from "@config/data-source";

export class BaseRepository<T> {
  protected database: Repository<ObjectLiteral>;

  constructor(entity: Type<T>) {
    this.database = dataSource.getRepository(entity);
  }
}
