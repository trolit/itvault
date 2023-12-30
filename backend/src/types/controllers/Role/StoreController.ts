import { RoleMapper } from "@mappers/RoleMapper";
import { IAddEditRoleDto } from "@shared/types/DTOs/Role";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddEditRoleDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<RoleMapper | string>;
  }
}
