import { BaseMapper } from "@mappers/BaseMapper";

import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

export class EntityMapperService implements IEntityMapperService {
  mapOneToDto<T, Y extends BaseMapper<T>>(
    entity: T,
    target: new (data: T) => Y
  ): Y {
    return new target(entity);
  }

  mapToDto<T, Y extends BaseMapper<T>>(
    entities: T[],
    target: new (data: T) => Y
  ): Y[] {
    return entities.map(entity => new target(entity));
  }
}
