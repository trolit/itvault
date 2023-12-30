import { IAddEditRoleDTO } from "@shared/types/DTOs/Role";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditRoleDTO;

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
