import { IAddEditRoleDto } from "@shared/types/dtos/Role";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditRoleDto;

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
