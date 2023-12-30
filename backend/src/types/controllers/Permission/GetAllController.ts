import { IPermissionDTO } from "@shared/types/DTOs/Permission";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<void, void, void>;

    export type Response = CustomResponse<IPermissionDTO[]>;
  }
}
