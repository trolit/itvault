/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

const DATA_SYMBOL = Symbol("DATA");
const INITIAL_KEYS_SYMBOL = Symbol("INITIAL_KEYS");

// @NOTE we could remove it and manually map "inherited" keys but this is thing to consider.
export abstract class BaseMapper<T> {
  constructor(data: T, initialKeys: (keyof T)[]) {
    (this as any)[DATA_SYMBOL] = data;
    (this as any)[INITIAL_KEYS_SYMBOL] = initialKeys;

    this.assignInitialKeys();
  }

  // @NOTE solution to native JS property initialistation (useDefineForClassFields = true)
  assignInitialKeys() {
    this._mapKeys((this as any)[INITIAL_KEYS_SYMBOL]);
  }

  overwriteInitialKeys(inheritedKeys?: (keyof T)[]) {
    if (inheritedKeys) {
      this._mapKeys(inheritedKeys);
    }
  }

  private _mapKeys(keys: (keyof T)[]) {
    keys.map(key => {
      const value = (this as any)[DATA_SYMBOL][key];

      if (typeof value !== undefined) {
        (this as any)[key] = value;
      }
    });
  }
}
