import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

export namespace UpdateManyControllerTypes {
  export namespace v1 {
    export type Body = {
      values: UpdateUserDto[];
    };

    export type Request = CustomRequest<undefined, Body>;

    export type Response = CustomResponse<string>;
  }
}
