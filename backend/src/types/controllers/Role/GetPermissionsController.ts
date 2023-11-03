import { PermissionDto } from "@shared/types/dtos/PermissionDto";

export namespace GetPermissionsControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, void, void>;

    export type Response = CustomResponse<PermissionDto[]>;
  }
}
