import { User } from "@entities/User";
import { UserMapDto } from "@dtos/UserMapDto";
import { PaginatedResponse } from "miscellaneous-types";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export namespace GetAllControllerTypes {
  export namespace v1 {
    export type Body = Pick<User, "email" | "password">;

    export type Request = CustomRequest<
      undefined,
      undefined,
      IPaginationOptions
    >;

    export type Response = CustomResponse<PaginatedResponse<UserMapDto>>;
  }
}
