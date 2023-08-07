import { BaseMapper } from "@mappers/BaseMapper";

export interface IEntityMapperService {
  mapOneToDto<T, Y extends BaseMapper<T>>(
    entity: T,
    target: new (data: T) => Y
  ): Y;

  mapToDto<T, Y extends BaseMapper<T>>(
    entities: T[],
    target: new (data: T) => Y
  ): Y[];
}
