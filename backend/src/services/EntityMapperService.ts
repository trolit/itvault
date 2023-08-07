import { BaseMapper } from "@mappers/BaseMapper";

import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

export class EntityMapperService implements IEntityMapperService {
  map<T, Y extends BaseMapper<T>>(entity: T, mapper: new (data: T) => Y): Y;

  map<T, Y extends BaseMapper<T>>(entity: T[], mapper: new (data: T) => Y): Y[];

  map<T, Y extends BaseMapper<T>>(
    entity: T | T[],
    mapper: new (data: T) => Y
  ): Y | Y[] {
    if (Array.isArray(entity)) {
      return entity.map(entity => new mapper(entity));
    }

    return new mapper(entity);
  }
}
