import { Base } from "@entities/Base";
import { Type } from "@utils/types";

export interface IEntityMapperService {
  mapOneToDto<T extends Base, Y extends Partial<T>>(
    entity: T,
    target: Type<Y>,
    customProps?: (from: T) => Partial<Y>
  ): Y;

  mapToDto<T extends Base, Y extends Partial<T>>(
    entities: T[],
    target: Type<Y>,
    customProps?: (from: T) => Partial<Y>
  ): Y[];
}
