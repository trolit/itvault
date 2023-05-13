import { container, InjectionToken } from "tsyringe";

export const getInstanceOf = <T>(token: InjectionToken<T>): T =>
  container.resolve(token);
