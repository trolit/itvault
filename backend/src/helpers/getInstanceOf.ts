import { container, InjectionToken } from "tsyringe";

import { Dependency } from "@enums/Dependency";

export const getInstanceOf = <T>(token: InjectionToken<T>): T => {
  if (!container.isRegistered(token)) {
    const tokenAsString = token.toString();

    log.error({
      message: `Attempted to resolve unregistered dependency (${tokenAsString})!`,
      dependency: Dependency.tsyringe,
    });
  }

  return container.resolve(token);
};
