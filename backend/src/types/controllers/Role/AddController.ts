import { RoleMapper } from "@mappers/RoleMapper";
import { IAddEditRoleDTO } from "@shared/types/DTOs/Role";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Body = IAddEditRoleDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<RoleMapper | string>;
  }
}
