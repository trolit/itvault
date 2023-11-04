import { IPermissionDto } from "@shared/types/dtos/IPermissionDto";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<void, void, void>;

    export type Response = CustomResponse<IPermissionDto[]>;
  }
}
