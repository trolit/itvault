import { RoleMapper } from "@mappers/RoleMapper";
import { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditRoleDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<RoleMapper | string>;
  }
}
