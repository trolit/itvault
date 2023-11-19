/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

const DATA_SYMBOL = Symbol("DATA");

// @NOTE we could remove it and manually map "inherited" keys but this is thing to consider.
export abstract class BaseMapper<T> {
  constructor(data: T, initialKeys: (keyof T)[]) {
    (this as any)[DATA_SYMBOL] = data;

    this.overwriteInitialKeys(initialKeys);
  }

  overwriteInitialKeys(inheritedKeys?: (keyof T)[]) {
    if (inheritedKeys) {
      inheritedKeys.map(key => {
        const value = (this as any)[DATA_SYMBOL][key];

        if (typeof value !== undefined) {
          (this as any)[key] = value;
        }
      });
    }
  }
}
