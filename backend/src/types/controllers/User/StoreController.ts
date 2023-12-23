import { UserMapper } from "@mappers/UserMapper";
import { IAddUserDto } from "@shared/types/dtos/User";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddUserDto;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UserMapper>;
  }
}
