import { RoleMapper } from "@mappers/RoleMapper";
import { IRoleAddEditDto } from "@shared/types/dtos/Role";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IRoleAddEditDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<RoleMapper | string>;
  }
}
