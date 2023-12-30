import { UserMapper } from "@mappers/UserMapper";
import { IAddUserDTO } from "@shared/types/dtos/User";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Body = IAddUserDTO;

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<UserMapper>;
  }
}
