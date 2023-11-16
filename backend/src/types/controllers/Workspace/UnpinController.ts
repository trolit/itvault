export namespace UnpinControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params>;

    export type Response = CustomResponse<void>;
  }
}
