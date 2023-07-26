import { RoleMapDto } from "@dtos/mappers/RoleMapDto";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddEditRoleDto>;

    export type Response = CustomResponse<RoleMapDto | string>;
  }
}
