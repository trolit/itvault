export abstract class BaseMapDto<T> {
  constructor(data: T, keys: (keyof T)[]) {
    keys.map(key => {
      if (data[key]) {
        (this as any)[key] = data[key];
      }
    });
  }
}
