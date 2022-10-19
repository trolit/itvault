import { container, InjectionToken } from "tsyringe";

export const instanceOf = <T>(token: InjectionToken<T>): T =>
  container.resolve(token);
