import { Base } from "@entities/Base";

export interface IEntityMapperService {
  mapOneToDto<T extends Base, Y>(entity: T, target: new (data: T) => Y): Y;

  mapToDto<T extends Base, Y>(entities: T[], target: new (data: T) => Y): Y[];
}
