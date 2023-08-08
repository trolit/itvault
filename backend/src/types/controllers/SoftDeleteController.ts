export namespace SoftDeleteControllerTypes {
  export namespace v1 {
    export type Params = {
      id: string;
    };

    export type Request = CustomRequest<Params>;
  }
}
