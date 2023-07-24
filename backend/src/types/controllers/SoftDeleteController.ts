export namespace SoftDeleteControllerTypes {
  export namespace v1 {
    type Params = {
      id: number | string;
    };

    export type Request = CustomRequest<Params>;
  }
}
