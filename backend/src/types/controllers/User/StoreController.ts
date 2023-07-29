import { UserMapDto } from "@dtos/mappers/UserMapDto";
import { AddEditUserDto } from "@dtos/AddEditUserDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditUserDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UserMapDto>;
  }
}
