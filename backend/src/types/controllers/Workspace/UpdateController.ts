export namespace UpdateControllerTypes {
  export namespace v1 {
    type Params = {
      id: number;
    };

    // @TODO DTO!!
    type Body = {
      name: string;

      tags: string[];
    };

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
