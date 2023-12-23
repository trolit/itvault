import { IRoleAddEditDto } from "@shared/types/dtos/Role";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IRoleAddEditDto;

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
