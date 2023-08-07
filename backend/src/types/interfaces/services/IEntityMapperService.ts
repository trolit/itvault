import { BaseMapper } from "@mappers/BaseMapper";

export interface IEntityMapperService {
  map<T, Y extends BaseMapper<T>>(entity: T, mapper: new (data: T) => Y): Y;

  map<T, Y extends BaseMapper<T>>(entity: T[], mapper: new (data: T) => Y): Y[];
}
