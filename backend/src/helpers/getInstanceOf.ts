import { container, InjectionToken } from "tsyringe";

// @TODO check if dependency is registered in `container`
export const getInstanceOf = <T>(token: InjectionToken<T>): T =>
  container.resolve(token);
