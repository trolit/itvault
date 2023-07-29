import { RoleMapDto } from "@dtos/mappers/RoleMapDto";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditRoleDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<RoleMapDto | string>;
  }
}
