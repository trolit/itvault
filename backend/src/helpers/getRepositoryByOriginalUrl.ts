import { container } from "tsyringe";
import capitalize from "lodash/capitalize";

import { getInstanceOf } from "./getInstanceOf";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

// @TODO adjust after API versioning refactor!
export const getRepositoryByOriginalUrl = (originalUrl: string) => {
  // @NOTE e.g. /api/notes/v1/1
  const resourceInPlural = originalUrl.split("/").at(-2);

  if (!resourceInPlural) {
    return null;
  }

  const resource = resourceInPlural.slice(0, -1);

  const dependency = `I${capitalize(resource)}Repository`;

  if (!container.isRegistered(dependency)) {
    return null;
  }

  return getInstanceOf<IBaseRepository<unknown>>(dependency);
};
