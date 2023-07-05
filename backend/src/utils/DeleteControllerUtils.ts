import { capitalize } from "lodash";
import { container } from "tsyringe";

import { IBaseRepository } from "@interfaces/repositories/IBaseRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

export abstract class DeleteControllerUtils {
  // @TODO adjust after API versioning refactor to hybrid approach!
  getRepositoryByOriginalUrl<T>(originalUrl: string) {
    // @NOTE e.g. /api/notes/v1/1, /api/workspaces/1/files/1/v1
    const resourceInPlural = originalUrl.split("/").at(-3);

    if (!resourceInPlural) {
      return null;
    }

    const resource = resourceInPlural.slice(0, -1);

    const dependency = `I${capitalize(resource)}Repository`;

    if (!container.isRegistered(dependency)) {
      return null;
    }

    return getInstanceOf<IBaseRepository<T>>(dependency);
  }
}
