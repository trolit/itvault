declare module "miscellaneous-types" {
  // @NOTE https://stackoverflow.com/questions/39622778/what-is-new-in-typescript
  export type Type<T> = new (...args: unknown[]) => T;

  export type BucketContent = Record<number, string[]>;

  export type ControllerImplementation = {
    version: number;

    handler: (
      request: CustomRequest<any, any, any>,
      response: CustomResponse<any>
    ) => Promise<CustomResponse<any>>;
  };
}
