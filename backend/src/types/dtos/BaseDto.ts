export abstract class BaseDto<T> {
  constructor(data: T, keys: (keyof T)[]) {
    keys.map(key => {
      if (data[key]) {
        (this as any)[key] = data[key];
      }
    });
  }
}
