import { IUpdateUserDto } from "@shared/types/dtos/User";

export namespace UpdateManyControllerTypes {
  export namespace v1 {
    export type Body = {
      values: IUpdateUserDto[];
    };

    export type Request = CustomRequest<void, Body>;

    export type Response = CustomResponse<string>;
  }
}
