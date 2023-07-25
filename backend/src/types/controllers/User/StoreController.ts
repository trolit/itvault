import { UserMapDto } from "@dtos/UserMapDto";
import { AddEditUserDto } from "@dtos/AddEditUserDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Request = CustomRequest<undefined, AddEditUserDto>;

    export type Response = CustomResponse<UserMapDto>;
  }
}
