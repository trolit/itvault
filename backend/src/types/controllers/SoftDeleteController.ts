export namespace SoftDeleteControllerTypes {
  export namespace v1 {
    type Params = {
      id: string;
    };

    export type Request = CustomRequest<Params>;
  }
}
