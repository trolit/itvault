import { BaseMapDto } from "@dtos/BaseMapDto";

export interface IEntityMapperService {
  mapOneToDto<T, Y extends BaseMapDto<T>>(
    entity: T,
    target: new (data: T) => Y
  ): Y;

  mapToDto<T, Y extends BaseMapDto<T>>(
    entities: T[],
    target: new (data: T) => Y
  ): Y[];
}
