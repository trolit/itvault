/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

// @NOTE we could remove it and manually map "inherited" keys but this is thing to consider.
export abstract class BaseMapper<T> {
  constructor(data: T, keys: (keyof T)[]) {
    keys.map(key => {
      if (typeof data[key] !== undefined) {
        (this as any)[key] = data[key];
      }
    });
  }
}
