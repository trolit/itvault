import { Base } from "@entities/Base";
import { BaseMapDto } from "@dtos/BaseMapDto";
import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

export class EntityMapperService implements IEntityMapperService {
  mapOneToDto<T extends Base, Y extends BaseMapDto<T>>(
    entity: T,
    target: new (data: T) => Y
  ): Y {
    return new target(entity);
  }

  mapToDto<T extends Base, Y extends BaseMapDto<T>>(
    entities: T[],
    target: new (data: T) => Y
  ): Y[] {
    return entities.map(entity => new target(entity));
  }
}
