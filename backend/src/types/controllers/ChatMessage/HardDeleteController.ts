export namespace HardDeleteControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params>;
  }
}
