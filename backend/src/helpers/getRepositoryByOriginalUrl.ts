import { capitalize } from "lodash";
import { container } from "tsyringe";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { getInstanceOf } from "./getInstanceOf";

export const getRepositoryByOriginalUrl = <T>(originalUrl: string) => {
  // @NOTE e.g. /api/v1/notes/1?version=1
  const resourceInPlural = originalUrl.split("/").at(-2);

  if (!resourceInPlural) {
    return null;
  }

  const resource = resourceInPlural.slice(0, -1);

  const dependency = `I${capitalize(resource)}Repository`;

  if (!container.isRegistered(dependency)) {
    return null;
  }

  return getInstanceOf<IBaseRepository<T>>(dependency);
};
