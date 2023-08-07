import { UserMapper } from "@mappers/UserMapper";
import { AddEditUserDto } from "@shared/types/dtos/AddEditUserDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = AddEditUserDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UserMapper>;
  }
}
