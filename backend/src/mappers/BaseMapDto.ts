/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class BaseMapDto<T> {
  constructor(data: T, keys: (keyof T)[]) {
    keys.map(key => {
      if (data[key]) {
        (this as any)[key] = data[key];
      }
    });
  }
}
