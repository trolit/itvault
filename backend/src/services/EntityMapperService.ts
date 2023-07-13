import { Base } from "@entities/Base";
import { IEntityMapperService } from "@interfaces/services/IEntityMapperService";

export class EntityMapperService implements IEntityMapperService {
  mapOneToDto<T extends Base, Y>(entity: T, target: new (data: T) => Y): Y {
    return new target(entity);
  }

  mapToDto<T extends Base, Y>(entities: T[], target: new (data: T) => Y): Y[] {
    return entities.map(entity => new target(entity));
  }
}
