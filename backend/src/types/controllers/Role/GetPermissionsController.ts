import { IRolePermissionDto } from "@shared/types/dtos/Permission";

export namespace GetPermissionsControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, void, void>;

    export type Response = CustomResponse<IRolePermissionDto[]>;
  }
}
