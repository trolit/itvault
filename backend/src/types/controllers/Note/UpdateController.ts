export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = {
      text: string;
    };

    export type Request = CustomRequest<Params, Body>;
  }
}
