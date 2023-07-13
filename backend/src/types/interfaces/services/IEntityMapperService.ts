import { Base } from "@entities/Base";
import { BaseMapDto } from "@dtos/BaseMapDto";

export interface IEntityMapperService {
  mapOneToDto<T extends Base, Y extends BaseMapDto<T>>(
    entity: T,
    target: new (data: T) => Y
  ): Y;

  mapToDto<T extends Base, Y extends BaseMapDto<T>>(
    entities: T[],
    target: new (data: T) => Y
  ): Y[];
}
