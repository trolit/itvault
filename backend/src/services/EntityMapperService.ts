import { Base } from "@entities/Base";
import { Type } from "@utils/types";
import { IEntityMapperService } from "@interfaces/service/IEntityMapperService";

export class EntityMapperService implements IEntityMapperService {
  mapOneToDto<T extends Base, Y extends Partial<T>>(
    entity: T,
    target: Type<Y>,
    customProps?: (from: T) => Partial<Y>
  ): Y {
    return resolveMap(entity, target, customProps);
  }

  mapToDto<T extends Base, Y extends Partial<T>>(
    entities: T[],
    target: Type<Y>,
    customProps?: (from: T) => Partial<Y>
  ): Y[] {
    return entities.map(entity => resolveMap(entity, target, customProps));
  }
}

function resolveMap<T extends Base, Y extends Partial<T>>(
  entity: T,
  target: Type<Y>,
  customProps?: (from: T) => Partial<Y>
) {
  const targetInstance = new target();

  const targetKeys = Object.keys(targetInstance);

  for (const [key, value] of Object.entries(entity)) {
    if (targetKeys.includes(key)) {
      targetInstance[key as keyof Y] = value;
    }
  }

  if (customProps) {
    const customPropsResult = customProps(entity);

    return {
      ...targetInstance,
      ...customPropsResult,
    };
  }

  return targetInstance;
}
