import { IRolePermissionDTO } from "@shared/types/DTOs/Role";

export namespace GetPermissionsControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, void, void>;

    export type Response = CustomResponse<IRolePermissionDTO[]>;
  }
}
