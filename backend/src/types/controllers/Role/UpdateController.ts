import { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = AddEditRoleDto;

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
