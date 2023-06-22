declare module "@commonTypes" {
  // @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
  export type Type<T> = new (...args: unknown[]) => T;
}
